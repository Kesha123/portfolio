import os
import boto3
import json


S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY')


def main(args):
    session = boto3.session.Session()
    client = session.client(
                                's3',
                                endpoint_url='https://ams3.digitaloceanspaces.com',
                                region_name='ams3',
                                aws_access_key_id=S3_ACCESS_KEY,
                                aws_secret_access_key=S3_SECRET_KEY
                            )

    data = client.get_object(
        Bucket='portfolio-bucket-innokentii',
        Key='projects.json'
    ).get('Body').read().decode('utf-8')

    projects = json.loads(data)

    return {"body": projects}
