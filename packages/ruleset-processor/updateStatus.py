import os
import json
import boto3
import sqlalchemy
from aws_xray_sdk.core import xray_recorder

xray_recorder.configure(service='Update Status')

DATABASE_SECRET_NAME = os.environ['DATABASE_SECRET_NAME']
REGION = os.environ['REGION']

def get_db():
    xray_recorder.begin_subsegment('Get database credentials')
    client = boto3.client('secretsmanager', region_name=REGION)
    secret_json = json.loads(client.get_secret_value(SecretId = DATABASE_SECRET_NAME)['SecretString'])
    connection_string = f"postgresql://{secret_json['username']}:{secret_json['password']}@{secret_json['host']}:{str(secret_json['port'])}/{secret_json['dbname']}"
    db = sqlalchemy.create_engine(connection_string)
    xray_recorder.end_subsegment()
    return db


def update_ruleset_status(ruleset, status):
    xray_recorder.begin_subsegment('Update status')
    db = get_db()
    with db.connect() as connection:
      sql = f'''
      UPDATE rulesets SET status='{status}' WHERE id ='{ruleset['id']}';
      '''
      print(sql)
      db.execute(sql)
    xray_recorder.end_subsegment()

def handler(event, context):
    ruleset = event['ruleset']
    status = event['status']
    update_ruleset_status(ruleset, status)
