import os
import time
import json
import boto3
import pandas as pd
import numpy as np
import sqlalchemy
from aws_xray_sdk.core import xray_recorder
from datetime import datetime


xray_recorder.configure(service='Process Ruleset')

STAYS_PREFIX = 'stays'
RULESETS_PREFIX = 'rulesets'
DATABASE_SECRET_NAME = os.environ['DATABASE_SECRET_NAME']
MIMIC_DATABASE_SECRET_NAME = os.environ['MIMIC_DATABASE_SECRET_NAME']
REGION = os.environ['REGION']
PARAMETER_DTYPES = {
    'stay_id':                       'int',
    'charttime':                     'string',
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


def compute_rules(frame, ruleset):
    for rule in ruleset['rules']:
        if rule['operation'] == '<':
            frame[rule['id']] = frame[rule['parameter']] < rule['value']
        elif rule['operation'] == '>':
            frame[rule['id']] = frame[rule['parameter']] > rule['value']
        elif rule['operation'] == '=':
            if pd.isna(rule['value']):
                frame[rule['id']] = pd.isna(frame[rule['parameter']])
            elif rule['parameter'] == 'o2_delivery_devices':
                frame[rule['id']] = frame[rule['parameter']].str.contains(rule['value'])
            else:
                frame[rule['id']] = frame[rule['parameter']] == rule['value']
        elif rule['operation'] == '!=':
            if pd.isna(rule['value']):
                frame[rule['id']] = pd.notna(frame[rule['parameter']])
            elif rule['parameter'] == 'o2_delivery_devices':
                frame[rule['id']] = ~frame[rule['parameter']].str.contains(rule['value'])
            else:
                frame[rule['id']] = frame[rule['parameter']] != rule['value']
        else:
            raise Exception(f'Invalid operation in rule definition. Could not find operation for: "{rule["operation"]}".')


def compute_relations(frame, ruleset):
     for relation in ruleset['relations']:
         if relation['operation'] == 'OR':
             frame[relation['id']] = frame[relation['dependencies']].any(axis='columns')
         elif relation['operation'] == 'AND':
             frame[relation['id']] = frame[relation['dependencies']].all(axis='columns')
         else:
             raise Exception(f'Invalid operation in relation definition. Could not find operation for: "{relation["operation"]}".')


def get_parameters_to_select(ruleset):
    parameters = []
    for rule in ruleset['rules']:
        parameters.append(rule['parameter'])
    return parameters


def process(frame, ruleset):
    xray_recorder.begin_subsegment('Compute rules')
    compute_rules(frame, ruleset)
    xray_recorder.end_subsegment()
    xray_recorder.begin_subsegment('Compute relations')
    compute_relations(frame, ruleset)
    xray_recorder.end_subsegment()
    return frame


def fetch_data(bucket, filename):
    xray_recorder.begin_subsegment('Fetch data')
    client = boto3.client('s3')
    data = client.get_object(Bucket=bucket, Key=filename)['Body']
    xray_recorder.end_subsegment()
    xray_recorder.begin_subsegment('Load data into frame')
    frame = pd.read_csv(data, dtype=PARAMETER_DTYPES)
    xray_recorder.end_subsegment()
    return frame


def get_db():
    xray_recorder.begin_subsegment('Get database credentials')
    client = boto3.client('secretsmanager', region_name=REGION)
    wls = json.loads(client.get_secret_value(SecretId = DATABASE_SECRET_NAME)['SecretString'])
    connection_string = f"postgresql://{wls['username']}:{wls['password']}@{wls['host']}:{str(wls['port'])}/{wls['dbname']}"
    db = sqlalchemy.create_engine(connection_string)
    xray_recorder.end_subsegment()
    return db


def get_label_length(label):
    date_format = '%Y-%m-%d %H:%M:%S'
    start = datetime.strptime(label['startTime'], date_format)
    end = datetime.strptime(label['endTime'], date_format)
    hours_between = (end - start).total_seconds() / 3600
    # Add one hour to include the current time window
    return hours_between + 1


# Compute labels for a specific stay
def compute_labels_for_stay(frame, ruleset, stay_id):
    xray_recorder.begin_subsegment('Compute labels for stay')
    labels = []
    in_label = False
    start_time = None
    previous_row = None

    for index, row in frame.iterrows():
        if row[ruleset['root']] == True:
            if not in_label:
                in_label = True
                start_time = row['charttime']
        elif in_label:
            labels.append({
                'stayId': stay_id,
                'startTime': start_time,
                'endTime': previous_row['charttime']
            })
            in_label = False
            start_time = None
        previous_row = row

    if in_label:
        labels.append({
            'stayId': stay_id,
            'startTime': start_time,
            'endTime': previous_row['charttime']
        })
    xray_recorder.end_subsegment()
    return labels


def compute_statistics_and_labels(frame, ruleset):
    xray_recorder.begin_subsegment('Compute statistics')
    statistics = []
    labels = []
    unique_stay_ids = frame['stay_id'].unique().tolist()
    for stay_id in unique_stay_ids:
        stay_rows = frame[frame['stay_id'] == stay_id]
        stay_labels = compute_labels_for_stay(stay_rows, ruleset, stay_id)
        durations = [get_label_length(label) for label in stay_labels]
        statistics.append({
            'stayId': stay_id,
            'rowCount': len(stay_rows),
            'labelledRowCount': len(stay_rows[stay_rows[ruleset['root']] == True]),
            'labelCount': len(stay_labels),
            'totalDuration': get_label_length({'startTime': stay_rows.iloc[0]['charttime'], 'endTime': stay_rows.iloc[-1]['charttime']}) if len(stay_rows) > 0 else 0,
            'totalLabelDuration': sum(durations) if len(durations) > 0 else 0,
            'percentageRowsLabelled': len(stay_rows[stay_rows[ruleset['root']] == True]) / len(stay_rows) if len(stay_rows) > 0 else 0,
            'minLabelDuration': min(durations) if len(durations) > 0 else 0,
            'maxLabelDuration': max(durations) if len(durations) > 0 else 0,
            'avgLabelDuration': (sum(durations) / len(durations)) if len(durations) > 0 else 0,
        })
        labels = labels + stay_labels

    xray_recorder.end_subsegment()
    return statistics, labels


def get_statistics_filename(data_filename, ruleset):
    file_number = data_filename.split('_')[1].split('.')[0]
    return f'{RULESETS_PREFIX}/{ruleset["id"]}/statistics_{file_number}.json'


def get_labels_filename(data_filename, ruleset):
    file_number = data_filename.split('_')[1].split('.')[0]
    return f'{RULESETS_PREFIX}/{ruleset["id"]}/labels_{file_number}.json'


def save_to_s3(body, bucket, filename, content_type):
    xray_recorder.begin_subsegment('Save file to S3')
    client = boto3.client('s3')
    data = client.put_object(Body=body, Bucket=bucket, Key=filename, ContentType=content_type)
    xray_recorder.end_subsegment()


def encode_json(object):
    return json.dumps(object, separators=(',', ':')).encode('utf-8')


def handler(event, context):
    xray_recorder.begin_segment('Main handler')
    ruleset = event['ruleset']
    bucket = event['bucket']
    filename = event['filename']
    data = fetch_data(bucket, filename)
    processed = process(data, ruleset)
    statistics, labels = compute_statistics_and_labels(processed, ruleset)
    statistics_filename = get_statistics_filename(filename, ruleset)
    labels_filename = get_labels_filename(filename, ruleset)
    save_to_s3(encode_json(statistics), bucket, get_statistics_filename(filename, ruleset), 'application/json')
    save_to_s3(encode_json(labels), bucket, get_labels_filename(filename, ruleset), 'application/json')
    xray_recorder.end_segment()
    return {"statisticsFilename": statistics_filename, "labelsFilename": labels_filename}
