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


def compute_aggregate_statistics(statistics):
    xray_recorder.begin_subsegment('Compute aggregate statistics')
    aggregate = {}
    aggregate["rowCount"] = sum([s['rowCount'] for s in statistics])
    aggregate["labelledRowCount"] = sum([s['labelledRowCount'] for s in statistics])
    aggregate["labelCount"] = sum([s['labelCount'] for s in statistics])
    aggregate["minLabelDuration"] = min([s['minLabelDuration'] for s in statistics])
    aggregate["maxLabelDuration"] = sum([s['maxLabelDuration'] for s in statistics])
    aggregate["totalLabelDuration"] = sum([s['totalLabelDuration'] for s in statistics])
    aggregate["avgLabelDuration"] = (aggregate["totalLabelDuration"] / aggregate["labelCount"]) if aggregate["labelCount"] > 0 else 0
    aggregate["percentageRowsLabelled"] = (aggregate["labelledRowCount"] / aggregate["rowCount"]) if aggregate["rowCount"] > 0 else 0

    statistics.sort(key = lambda x: x['minLabelDuration'])
    aggregate["minLabelDurationTopTen"] = [s['stayId'] for s in statistics[-10:]]
    aggregate["minLabelDurationTopTen"].reverse()
    aggregate["minLabelDurationBottomTen"] = [s['stayId'] for s in statistics[:10]]

    statistics.sort(key = lambda x: x['maxLabelDuration'])
    aggregate["maxLabelDurationTopTen"] = [s['stayId'] for s in statistics[-10:]]
    aggregate["maxLabelDurationTopTen"].reverse()
    aggregate["maxLabelDurationBottomTen"] = [s['stayId'] for s in statistics[:10]]

    statistics.sort(key = lambda x: x['avgLabelDuration'])
    aggregate["avgLabelDurationTopTen"] = [s['stayId'] for s in statistics[-10:]]
    aggregate["avgLabelDurationTopTen"].reverse()
    aggregate["avgLabelDurationBottomTen"] = [s['stayId'] for s in statistics[:10]]

    statistics.sort(key = lambda x: x['labelCount'])
    aggregate["labelCountTopTen"] = [s['stayId'] for s in statistics[-10:]]
    aggregate["labelCountTopTen"].reverse()
    aggregate["labelCountBottomTen"] = [s['stayId'] for s in statistics[:10]]

    statistics.sort(key = lambda x: x['percentageRowsLabelled'])
    aggregate["percentageRowsLabelledTopTen"] = [s['stayId'] for s in statistics[-10:]]
    aggregate["percentageRowsLabelledTopTen"].reverse()
    aggregate["percentageRowsLabelledBottomTen"] = [s['stayId'] for s in statistics[:10]]

    xray_recorder.end_subsegment()
    return aggregate


def update_ruleset_statistics(statistics, ruleset):
    xray_recorder.begin_subsegment('Update statistics')
    insertable = json.dumps(statistics)
    db = get_db()
    with db.connect() as connection:
      sql = f'''
      UPDATE rulesets SET statistics = {insertable} WHERE id = {ruleset['id']};
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
