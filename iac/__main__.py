import pulumi
import pulumi_digitalocean as digitalocean


PORTFOLIO_DOMAIN_NAME = 'innokentii.eu'


project = digitalocean.get_project(name='Personal Portfolio')

domain = digitalocean.Domain('portfolio-domain',
    name=PORTFOLIO_DOMAIN_NAME
)

portfolio_SpacesBucket = digitalocean.SpacesBucket('portfolio-spaces-bucket',
    name='portfolio-bucket-innokentii',
    acl='private',
    region='ams3',
    versioning=digitalocean.SpacesBucketVersioningArgs(
        enabled=True,
    ),
)

portfolio_App = digitalocean.App('portfolio-app',
    project_id=project.id,
    spec=digitalocean.AppSpecArgs(
        region='ams',
        name='portfolio-app',
        domain_names=[digitalocean.AppSpecDomainNameArgs(
            name=PORTFOLIO_DOMAIN_NAME,
            type='PRIMARY',
        )],
        services=[digitalocean.AppSpecServiceArgs(
            environment_slug='node-js',
            github=digitalocean.AppSpecServiceGithubArgs(
                branch='main',
                deploy_on_push=True,
                repo='Kesha123/portfolio',
            ),
            instance_count=1,
            instance_size_slug='basic-xxs',
            name='portfolio-app-service',
            source_dir='frontend',
        )],
    )
)


pulumi.export('spaces_bucket_domain_name', portfolio_SpacesBucket.bucket_domain_name)
pulumi.export('app_url', portfolio_App.live_url)
pulumi.export('domain_name', domain.name)
