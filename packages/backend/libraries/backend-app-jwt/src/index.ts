import {
  JwtAlgorithm,
  JwtService,
  JwtServiceOptions,
} from '@cornie-js/backend-jwt';

import { JwtModuleOptions } from './adapter/nest/models/JwtModuleOptions';
import { JwtModule } from './adapter/nest/modules/JwtModule';

export type { JwtAlgorithm, JwtModuleOptions, JwtServiceOptions };

export { JwtModule, JwtService };
