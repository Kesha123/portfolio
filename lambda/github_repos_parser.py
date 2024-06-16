from dataclasses import dataclass
from dataclasses import asdict
import os
import requests
import boto3
import json



@dataclass
class Project:
    id: int
    name: str
    description: str
    stack: list[str]
    sourceCode: str


GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
GITHUB_API_URL = 'https://api.github.com/users/Kesha123/repos'

ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')

REGION_NAME = 'eu-north-1'

def lambda_handler(event, context):
    session = boto3.session.Session()
    dynamoDB = session.resource(
                                'dynamodb',
                                region_name=REGION_NAME,
                                aws_access_key_id=ACCESS_KEY,
                                aws_secret_access_key=SECRET_KEY
                            )
    dynamoDB_table = dynamoDB.Table('github-projects')

    response = requests.request(
            method = 'GET',
            url = GITHUB_API_URL,
            headers = {
                'Accept': 'application/vnd.github+json',
                'Authorization': f'Bearer {GITHUB_TOKEN}'
            }
    ).text

    projects = [
        asdict(Project(
            id=project.get("id"),
            name=project.get("name"),
            sourceCode=project.get("html_url"),
            description=project.get("description"),
            stack=[i for i in requests.get(project.get('languages_url')).json()]
        ))
        for project in json.loads(response)
    ]

    for project in projects:
        dynamoDB_table.put_item(Item=project)
