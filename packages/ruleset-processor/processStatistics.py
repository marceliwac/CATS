import os
import time
import json
import boto3
import pandas as pd
import numpy as np
import sqlalchemy
from aws_xray_sdk.core import xray_recorder
from datetime import datetime


xray_recorder.configure(service='Process Statistics')

DATABASE_SECRET_NAME = os.environ['DATABASE_SECRET_NAME']
REGION = os.environ['REGION']


class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)


def get_db():
    xray_recorder.begin_subsegment('Get database credentials')
    client = boto3.client('secretsmanager', region_name=REGION)
    wls = json.loads(client.get_secret_value(SecretId = DATABASE_SECRET_NAME)['SecretString'])
    connection_string = f"postgresql://{wls['username']}:{wls['password']}@{wls['host']}:{str(wls['port'])}/{wls['dbname']}"
    db = sqlalchemy.create_engine(connection_string)
    xray_recorder.end_subsegment()
    return db


def load_files(bucket, filenames):
    xray_recorder.begin_subsegment('Load files')
    client = boto3.client('s3')
    result = []
    for filename in filenames:
        contents = client.get_object(Bucket=bucket, Key=filename)['Body'].read().decode('utf-8')
        parsed_file = json.loads(contents)
        result.append(parsed_file)
    xray_recorder.end_subsegment()
    return result


def insert_labels_to_db(labels, ruleset):
    xray_recorder.begin_subsegment('Insert annotations')
    if len(labels) > 0:
      db = get_db()
      with db.connect() as connection:
        insertable_labels = [f"'{label['stayId']}','{ruleset['id']}','{label['startTime']}',  '{label['endTime']}'" for label in labels]
        insertable = "(" + "),(".join(insertable_labels) + ")"
        sql = f'''
        INSERT INTO ruleset_labels (stay_id, ruleset_id, start_time, end_time) VALUES {insertable};
        '''
#         db.execute(sql)
      print(sql)
    xray_recorder.end_subsegment()

def flatten(list_of_lists):
    return [item for sublist in list_of_lists for item in sublist]


def get_aggregate_for(array, key):
    if len(array) < 1:
        raise Exception('Invalid array supplied! The array is empty')

    frame = pd.DataFrame(array)
    frame['value'] = frame[key]
    frame.sort_values(by=key, inplace=True)
    frame['index'] = range(1,len(frame) + 1)
    q1 = frame[key].quantile(.25)
    q3 = frame[key].quantile(.75)
    iqr = q3 - q1
    median = frame[key].median()
    avg = frame[key].mean()
    minOut = q1 - (1.5 * iqr)
    maxOut = q3 + (1.5 * iqr)
    dmin = frame.iloc[0][key]
    dmax = frame.iloc[-1][key]

    r1 = frame[(frame[key] >= minOut) & (frame[key] <= q1)]
    r2 = frame[(frame[key] >= q1) & (frame[key] <= median)]
    r3 = frame[(frame[key] >= median) & (frame[key] <= q3)]
    r4 = frame[(frame[key] >= q3) & (frame[key] <= maxOut)]

    vals, bins = np.histogram(frame[key], bins = 200)
    histogram = [[a,b] for a,b in list(zip(bins, vals))]

    return {
        "min": dmin,
        "minOut": minOut,
        "q1": q1,
        "median": median,
        "avg": avg,
        "q3": q3,
        "maxOut": maxOut,
        "max": dmax,
        "r1": {
            "lower": r1.iloc[:5][["index", "stayId", "value"]].to_dict('records'),
            "upper": r1.iloc[-5:][["index", "stayId", "value"]].to_dict('records')
        },
        "r2": {
            "lower": r2.iloc[:5][["index", "stayId", "value"]].to_dict('records'),
            "upper": r2.iloc[-5:][["index", "stayId", "value"]].to_dict('records')
        },
        "r3": {
            "lower": r3.iloc[:5][["index", "stayId", "value"]].to_dict('records'),
            "upper": r3.iloc[-5:][["index", "stayId", "value"]].to_dict('records')
        },
        "r4": {
            "lower": r4.iloc[:5][["index", "stayId", "value"]].to_dict('records'),
            "upper": r4.iloc[-5:][["index", "stayId", "value"]].to_dict('records')
        },
        "histogram": histogram
    }


def compute_aggregate_statistics(statistics):
    xray_recorder.begin_subsegment('Compute aggregate statistics')
    aggregate = {
        'total': {
            'rowCount': sum([s['rowCount'] for s in statistics]),
            'labelledRowCount': sum([s['labelledRowCount'] for s in statistics]),
            'labelCount': sum([s['labelCount'] for s in statistics]),
            'minLabelDuration': min([s['minLabelDuration'] for s in statistics]),
            'maxLabelDuration': sum([s['maxLabelDuration'] for s in statistics]),
            'totalLabelDuration': sum([s['totalLabelDuration'] for s in statistics]),
            'avgLabelDuration': (sum([s['totalLabelDuration'] for s in statistics]) / sum([s['labelCount'] for s in statistics])) if sum([s['labelCount'] for s in statistics]) > 0 else 0
        },
        'minLabelDuration': get_aggregate_for(statistics, 'minLabelDuration'),
        'maxLabelDuration': get_aggregate_for(statistics, 'maxLabelDuration'),
        'avgLabelDuration': get_aggregate_for(statistics, 'avgLabelDuration'),
        'totalLabelDuration': get_aggregate_for(statistics, 'totalLabelDuration'),
        'labelCount': get_aggregate_for(statistics, 'labelCount'),
        'percentageRowsLabelled': get_aggregate_for(statistics, 'percentageRowsLabelled')
    }
    xray_recorder.end_subsegment()
    return aggregate


def update_ruleset_statistics(statistics, ruleset):
    xray_recorder.begin_subsegment('Update statistics')
    insertable = json.dumps(statistics, separators=(',', ':') ,cls=NpEncoder)
    db = get_db()
    with db.connect() as connection:
      sql = f'''
      UPDATE rulesets SET statistics = '{insertable}' WHERE id = {ruleset['id']};
      '''
      print(sql)
#       db.execute(sql)
    xray_recorder.end_subsegment()

def handler(event, context):
    ruleset = event['ruleset']
    bucket = event['bucket']
    statistics_filenames = event['statisticsFilenames']
    labels_filenames = event['labelsFilenames']
    statistics = load_files(bucket, statistics_filenames)
    labels = load_files(bucket, labels_filenames)
    insert_labels_to_db(flatten(labels), ruleset)
    aggregate_statistics = compute_aggregate_statistics(flatten(statistics))
    update_ruleset_statistics(aggregate_statistics, ruleset)
