import { Region } from '@pulumi/aws';

export type Configuration = {
  project_name: string;
  root_domain: string;
  project_domain: string;
  ssl_certificate_region: Region;
  tags: { [key: string]: string };
};
