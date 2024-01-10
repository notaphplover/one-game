import { JwtAlgorithm } from '@cornie-js/backend-jwt';

import { MailConfig } from './MailConfig';

export interface Environment {
  apiBackendServiceSecret: string;
  frontendBaseUrl: string;
  corsOrigins: string[];
  grafanaPyroscopeEnabled: boolean;
  grafanaPyroscopeUrl: string;
  grafanaTraceEnabled: boolean;
  grafanaTraceUrl: string;
  host: string;
  jwtAlgorithm: JwtAlgorithm;
  jwtAudience: string;
  jwtExpirationMs: number;
  jwtIssuer: string;
  jwtPrivateKey: string;
  jwtPublicKey: string;
  mailConfig: MailConfig;
  port: number;
  typeOrmDatasourceOptions: Record<string, unknown>;
}
