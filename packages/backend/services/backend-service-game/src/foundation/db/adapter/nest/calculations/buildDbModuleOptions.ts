import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-game-env';
import { DbModuleOptions } from '@cornie-js/backend-game-adapter-typeorm';
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
