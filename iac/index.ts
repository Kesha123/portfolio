import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { Configuration } from './types/configuration.type';

let config = new pulumi.Config();
let configurationData = config.requireObject<Configuration>('data');

const rootZone = aws.route53.getZone({
  name: configurationData.root_domain,
});

const projectZone = new aws.route53.Zone(
  `${configurationData.project_name}-zone`,
  {
    name: configurationData.project_domain,
    tags: {
      Name: `${configurationData.project_name}-zone`,
      ...configurationData.tags,
    },
  },
);

new aws.route53.Record(`${configurationData.project_name}-ns-record`, {
  zoneId: rootZone.then((zone) => zone.zoneId),
  name: configurationData.project_domain,
  type: aws.route53.RecordType.NS,
  ttl: 30,
  records: projectZone.nameServers,
});

const certificate = new aws.acm.Certificate(
  `${configurationData.project_name}-certificate`,
  {
    domainName: configurationData.project_domain,
    validationMethod: 'DNS',
    tags: {
      Name: `${configurationData.project_name}-certificate`,
      ...configurationData.tags,
    },
  },
  {
    provider: new aws.Provider(`${configurationData.project_name}-certificate-provider`, {
      region: configurationData.ssl_certificate_region,
    }),
  },
);

new aws.route53.Record(`${configurationData.project_name}-certificate-validation`, {
  zoneId: projectZone.id,
  name: certificate.domainValidationOptions[0].resourceRecordName,
  type: certificate.domainValidationOptions[0].resourceRecordType,
  records: [certificate.domainValidationOptions[0].resourceRecordValue],
  ttl: 300,
});

const frontendBucket = new aws.s3.Bucket(
  `${configurationData.project_name}-frontend`,
  {
    website: {
      indexDocument: 'index.html',
    },
    tags: {
      Name: `${configurationData.project_name}-frontend-bucket`,
      ...configurationData.tags,
    },
  },
);

const originAccessControl = new aws.cloudfront.OriginAccessControl(
  `${configurationData.project_name}-origin-access-identity`,
  {
    name: `${configurationData.project_name}-origin-access-identity`,
    signingBehavior: 'always',
    signingProtocol: 'sigv4',
    originAccessControlOriginType: 's3',
  },
);

const cloudfront = new aws.cloudfront.Distribution(
  `${configurationData.project_name}-cloudfront`,
  {
    enabled: true,
    origins: [
      {
        originId: frontendBucket.arn,
        domainName: frontendBucket.bucketRegionalDomainName,
        s3OriginConfig: {
          originAccessIdentity: originAccessControl.id,
        },
      },
    ],
    defaultCacheBehavior: {
      targetOriginId: frontendBucket.arn,
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD'],
      cachedMethods: ['GET', 'HEAD'],
      forwardedValues: {
        queryString: false,
        cookies: {
          forward: 'none',
        },
      },
    },
    priceClass: 'PriceClass_100',
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
    viewerCertificate: {
      acmCertificateArn: certificate.arn,
    },
    aliases: [configurationData.project_domain],
    waitForDeployment: false,
  },
);

new aws.s3.BucketPolicy(
  `${configurationData.project_name}-frontend-bucket-cloudfront-policy`,
  {
    bucket: frontendBucket.bucket,
    policy: frontendBucket.bucket.apply((bucketName) =>
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: 'cloudfront.amazonaws.com',
            },
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${bucketName}/*`,
            Condition: {
              StringEquals: {
                'AWS:SourceArn': cloudfront.arn,
              },
            },
          },
        ],
      }),
    ),
  },
);

new aws.route53.Record(`${configurationData.project_name}-cloudfront-alias`, {
  zoneId: projectZone.id,
  name: configurationData.project_domain,
  type: aws.route53.RecordType.A,
  aliases: [
    {
      name: cloudfront.domainName,
      zoneId: cloudfront.hostedZoneId,
      evaluateTargetHealth: true,
    },
  ],
});

export const resources = {
  bucketName: frontendBucket.bucket,
  cloudfrontDomain: cloudfront.domainName,
};
