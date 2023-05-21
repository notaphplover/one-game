import { DbModuleOptions } from '@cornie-js/backend-app-game-db';
import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-game-env';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function buildDbModuleOptions(): DbModuleOptions {
  return {
    imports: [EnvModule],
    inject: [EnvironmentService],
    useFactory: (
      environmentService: EnvironmentService,
    ): TypeOrmModuleOptions =>
      environmentService.getEnvironment().typeOrmDatasourceOptions,
  };
}
