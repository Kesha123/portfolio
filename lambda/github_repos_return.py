import os
import boto3
import json
from decimal import Decimal

ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')

REGION_NAME = 'eu-north-1'


class DecimalEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, Decimal):
      return str(obj)
    return json.JSONEncoder.default(self, obj)


def lambda_handler(event, context):
    session = boto3.session.Session()
    dynamoDB = session.resource(
                                'dynamodb',
                                region_name=REGION_NAME,
                                aws_access_key_id=ACCESS_KEY,
                                aws_secret_access_key=SECRET_KEY
                            )
    dynamoDB_table = dynamoDB.Table('github-projects')
    repositories = dynamoDB_table.scan()

    return {
        'statusCode': 200,
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin" : "https://innokentii.eu",
            "Access-Control-Allow-Credentials" : True
        },
        'body': json.dumps(repositories['Items'], cls=DecimalEncoder)
    }
