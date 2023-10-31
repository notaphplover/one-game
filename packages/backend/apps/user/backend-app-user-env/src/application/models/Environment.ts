import { JwtAlgorithm } from '@cornie-js/backend-jwt';

import { MailConfig } from './MailConfig';

export interface Environment {
  apiBackendServiceSecret: string;
  frontendBaseUrl: string;
  corsOrigins: string[];
  grafanaTraceUrl: string;
  jwtAlgorithm: JwtAlgorithm;
  jwtAudience: string;
  jwtExpirationMs: number;
  jwtIssuer: string;
  jwtPrivateKey: string;
  jwtPublicKey: string;
  mailConfig: MailConfig;
  port: number;
  seedDummyData: boolean;
  typeOrmDatasourceOptions: Record<string, unknown>;
}
