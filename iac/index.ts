import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { Configuration } from './types/configuration.type';

let config = new pulumi.Config();
let configurationData = config.requireObject<Configuration>('data');

const rootZone = aws.route53.getZone({
  name: configurationData.root_domain,
});

new aws.route53.Record(`${configurationData.project_name}-cname-record`, {
  zoneId: rootZone.then((rootZone) => rootZone.zoneId),
  name: configurationData.project_domain,
  type: aws.route53.RecordType.CNAME,
  ttl: 30,
  records: [
    `${configurationData.project_domain}.${configurationData.root_domain}`,
  ],
});

export const resources = {
  websiteUrl: `${configurationData.project_domain}.${configurationData.root_domain}`,
};
