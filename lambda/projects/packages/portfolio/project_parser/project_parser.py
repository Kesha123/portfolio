from dataclasses import dataclass
from dataclasses import asdict
import os
import requests
import boto3
import json

@dataclass
class Project:
    name: str
    description: str
    stack: list[str]
    sourceCode: str


GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
GITHUB_API_URL = 'https://api.github.com/users/Kesha123/repos'

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
            name=project.get("name"),
            sourceCode=project.get("html_url"),
            description=project.get("description"),
            stack=[i for i in requests.get(project.get('languages_url')).json()]
        ))
        for project in json.loads(response)
    ]

    client.put_object(
                        Bucket='portfolio-bucket-innokentii',
                        Key='projects.json',
                        Body=json.dumps(projects).encode('utf-8'),
                        ACL='private',
                        Metadata={
                            'project': 'portfolio',
                        }
                    )
