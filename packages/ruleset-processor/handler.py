import os
import time
import json
import boto3
import pandas as pd
import numpy as np
import sqlalchemy
from aws_xray_sdk.core import xray_recorder

MIMIC_DATABASE_SECRET_NAME = os.environ['MIMIC_DATABASE_SECRET_NAME']
REGION = os.environ['REGION']
PARAMETER_DTYPES = {
    'stay_id':                       'int',
    'charttime':                     'datetime64[ns]',
    'heart_rate':                    'float',
    'arterial_bp_systolic':          'float',
    'arterial_bp_diastolic':         'float',
    'arterial_bp_mean':              'float',
    'bp_systolic_non_invasive':      'float',
    'bp_diastolic_non_invasive':     'float',
    'bp_mean_non_invasive':          'float',
    'cardiac_output_thermodilution': 'float',
    'respiratory_rate':              'float',
    'arterial_o2_pressure':          'float',
    'arterial_o2_saturation':        'float',
    'o2_saturation_pulseoxymetry':   'float',
    'peep_set_cleaned':              'float',
    'temperature':                   'float',
    'pcwp':                          'float',
    'inspired_o2_fraction':          'float',
    'ventilator_mode':               'string',
    'cuff_pressure':                 'float',
    'tidal_volume_set':              'float',
    'tidal_volume_observed':         'float',
    'tidal_volume_spontaneous':      'float',
    'minute_volume':                 'float',
    'percentage_minute_volume':      'float',
    'respiratory_rate_set':          'float',
    'respiratory_rate_spontaneous':  'float',
    'respiratory_rate_total':        'float',
    'peak_inspiratory_pressure':     'float',
    'plateau_pressure':              'float',
    'mean_airway_pressure':          'float',
    'total_peep_level':              'float',
    'sbt_started':                   'string',
    'sbt_stopped':                   'string',
    'sbt_successfully_completed':    'string',
    'sbt_deferred':                  'string',
    'expiratory_ratio':              'float',
    'inspiratory_ratio':             'float',
    'p_insp_draeger':                'float',
    'bipap_mode':                    'string',
    'bipap_epap':                    'float',
    'bipap_ipap':                    'float',
    'bipap_bpm':                     'float',
    'etco2':                         'float',
    'ventilator_mode_hamilton':      'string',
    'p_insp_hamilton':               'float',
    'resistance_expiry':             'float',
    'resistance_inspiry':            'float',
    'o2_delivery_devices':           'string',
    'o2_flow':                       'float',
    'o2_flow_additional':            'float'
}


@xray_recorder.capture('## op_eq')
def op_lt(parameter, value):
    return parameter < value


@xray_recorder.capture('## op_lt')
def op_gt(parameter, value):
    return parameter > value

@xray_recorder.capture('## op_eq')
def op_eq(parameter, value):
    return parameter == value


@xray_recorder.capture('## op_lt')
def op_neq(parameter, value):
    return parameter != value


@xray_recorder.capture('## get_rule_operation')
def get_rule_operation(rule):
    operator = rule['operator']
    if operator == '<':
        return op_lt
    if operator == '>':
        return op_gt
    if operator == '=':
        return op_eq
    if operator == '!=':
        return op_neq
    raise Exception(f'Invalid operator in rule definition. Could not find operation for: "{operator}".')


@xray_recorder.capture('## op_and')
def op_and(values):
    return all(values)


@xray_recorder.capture('## op_or')
def op_or(values):
    return any(values)


@xray_recorder.capture('## get_relation_operation')
def get_relation_operation(relation):
    operator = relation['operator']
    if operator == 'AND':
        return op_and
    if operator == 'OR':
        return op_or
    raise Exception(f'Invalid operator in relation definition. Could not find operation for: "{operator}".')


@xray_recorder.capture('## check_rule_value')
def check_rule_value(rule, value):
    operation = get_rule_operation(rule)
    # TODO: This could be parametrised and behaviour specified in the ruleset (i.e. treat nans as true / false)
    if(pd.isna(value)):
        return False
    return operation(value, rule['value'])


@xray_recorder.capture('## check_relation_value')
def check_relation_value(relation, values):
    operation = get_relation_operation(relation)
    return operation(values)


@xray_recorder.capture('## compute_rules')
def compute_rules(frame, ruleset):
    for rule in ruleset['rules']:
        frame[rule['name']] = frame[rule['parameter']].apply(lambda x: check_rule_value(rule, x))


@xray_recorder.capture('## compute_relations')
def compute_relations(frame, ruleset):
    for relation in ruleset['relations']:
        for index, row in frame.iterrows():
            dependencies = row[relation['dependencies']].values
            frame.loc[index,relation['name']] = check_relation_value(relation, dependencies)


@xray_recorder.capture('## get_parameters_to_select')
def get_parameters_to_select(ruleset):
    parameters = []
    for rule in ruleset['rules']:
        parameters.append(rule['parameter'])
    return parameters


@xray_recorder.capture('## get_objects_to_insert')
def get_objects_to_insert(frame, ruleset):
    values = frame[['stay_id', 'charttime', ruleset['root']]].values.tolist()
    return [row + [ruleset['id']] for row in values]


@xray_recorder.capture('## process')
def process(frame, ruleset):
    compute_rules(frame, ruleset)
    compute_relations(frame, ruleset)
    return frame


@xray_recorder.capture('## get_dtypes')
def get_dtypes(columns):
    dtypes = {}
    for column in columns:
        if column in PARAMETER_DTYPES:
            dtypes[column] = PARAMETER_DTYPES[column]
        else:
            dtypes[column] = 'string'
    return dtypes


@xray_recorder.capture('## fetch_data')
def fetch_data(db, event):
    limit = event['perPage']
    offset = event['page'] * limit
    parameters = get_parameters_to_select(event['ruleset'])
    columns = ['stay_id', 'charttime'] + parameters

    sql = f'''
    SELECT {','.join(columns)}
    FROM mimiciv_derived.wls_stage_2
    ORDER BY (stay_id, charttime)
    LIMIT {limit}
    OFFSET {offset};'''
    return pd.read_sql_query(sql, db, dtype=get_dtypes(columns))


@xray_recorder.capture('## insert_data')
def insert_data(db, frame, ruleset):
    new_data = get_objects_to_insert(frame, ruleset)
    insertable = "(" + "),(".join([(",".join([f"'{str(x)}'" for x in row])) for row in new_data]) + ")"

    sql = f'''
    INSERT INTO mimiciv_derived.wls_stage_3 (stay_id, charttime, label, ruleset_id) VALUES {insertable};
    '''
    db.execute(sql)


@xray_recorder.capture('## get_db')
def get_db():
    client = boto3.client('secretsmanager', region_name=REGION)
    mimic_secret = client.get_secret_value(SecretId = MIMIC_DATABASE_SECRET_NAME)['SecretString']
    return sqlalchemy.create_engine(mimic_secret)


def handler(event, context):
    ruleset = event['ruleset']
    db = get_db()
    with db.connect() as connection:
      data = fetch_data(connection, event)
      processed = process(data, ruleset)
      insert_data(connection, processed, ruleset)

    print('Labelled as true: ' + str(len(processed[processed[ruleset['root']] == True])) + ' of ' + str(len(processed)) + '.')


# TODO Ensure that the order of relationships conforms with the order in which they are being populated (i.e. if r2 depends on r1, r1 needs to be computed first)
