import pulumi
import uuid
import pulumi_digitalocean as digitalocean


config = pulumi.Config()
ssh_key_path = config.get('ssh_key_path') or '~/.ssh/id_rsa.pub'
portfolio_domain_name = config.get('portfolio_domain_name') or 'innokentii.eu'


ssh_key = digitalocean.SshKey('ssh-key',
    name='innokentii',
    public_key=(lambda path: open(path).read())(ssh_key_path)
)

tag = digitalocean.Tag('portfolio')

frontend_droplet = digitalocean.Droplet('frontend-droplet',
    image='ubuntu-20-04-x64',
    region=digitalocean.Region.AMS3,
    size=digitalocean.DropletSlug.DROPLET512MB,
    ssh_keys=[ssh_key.fingerprint],
    tags=[tag.id]
)

web_firewall = digitalocean.Firewall('web-firewall',
    droplet_ids=[frontend_droplet.id],
    inbound_rules=[
        digitalocean.FirewallInboundRuleArgs(
            protocol="tcp",
            port_range="443",
            source_addresses=[
                "0.0.0.0/0",
                "::/0",
            ],
        ),
    ],
    outbound_rules=[
        digitalocean.FirewallOutboundRuleArgs(
            protocol="tcp",
            port_range="53",
            destination_addresses=[
                "0.0.0.0/0",
                "::/0",
            ],
        ),
        digitalocean.FirewallOutboundRuleArgs(
            protocol="udp",
            port_range="53",
            destination_addresses=[
                "0.0.0.0/0",
                "::/0",
            ],
        ),
        digitalocean.FirewallOutboundRuleArgs(
            protocol="icmp",
            destination_addresses=[
                "0.0.0.0/0",
                "::/0",
            ],
        ),
    ]
)

portfolio_SpacesBucket = digitalocean.SpacesBucket('portfolio-spaces-bucket',
    name=f'portfolio-bucket-innokentii-{str(uuid.uuid4())}',
    acl='private',
    region='ams3',
    versioning=digitalocean.SpacesBucketVersioningArgs(
        enabled=True,
    ),
)

domain = digitalocean.Domain('portfolio-domain',
    name=portfolio_domain_name,
    ip_address=frontend_droplet.ipv4_address
)

dns_a_record = digitalocean.DnsRecord('portfolio-dns-record',
    domain=domain.id,
    type=digitalocean.RecordType.A,
    value=frontend_droplet.ipv4_address
)

try:
    project = digitalocean.get_project(name='Personal Portfolio')
    digitalocean.ProjectResources('project-resources',
        project_id=project.id,
        resources=[
            frontend_droplet.droplet_urn,
            domain.domain_urn,
            portfolio_SpacesBucket.bucket_urn,
        ]
    )
except Exception as e:
    project = digitalocean.Project('Personal Portfolio',
        description='Personal Portfolio',
        purpose='Personal Portfolio',
        environment='Production',
        resources=[
            frontend_droplet.droplet_urn,
            domain.domain_urn,
            portfolio_SpacesBucket.bucket_urn,
        ]
    )


pulumi.export('spaces_bucket_domain_name', portfolio_SpacesBucket.bucket_domain_name)
pulumi.export('spaces_bucket_name', portfolio_SpacesBucket.name)
pulumi.export('droplet_ipv4', frontend_droplet.ipv4_address)
