import pulumi
import pulumi_digitalocean as digitalocean


PORTFOLIO_DOMAIN_NAME = 'innokentii.eu'


project = digitalocean.get_project(name='Personal Portfolio')