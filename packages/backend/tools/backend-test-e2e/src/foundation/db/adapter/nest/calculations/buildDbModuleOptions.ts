import { DbModuleOptions } from '@cornie-js/backend-game-adapter-typeorm';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { EnvModule } from '../../../../../env/adapter/nest/modules/EnvModule';
import { EnvironmentService } from '../../../../../env/application/services/EnvironmentService';

export function buildDbModuleOptions(): DbModuleOptions {
  return {
    builders: {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      feature: TypeOrmModule.forFeature,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      root: TypeOrmModule.forRootAsync,
    },
    imports: [EnvModule],
    inject: [EnvironmentService],
    useFactory: (
      environmentService: EnvironmentService,
    ): TypeOrmModuleOptions =>
      environmentService.getEnvironment().gameTypeOrmDatasourceOptions,
  };
}
