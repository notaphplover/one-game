import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-user-env';
import { DbModuleOptions } from '@cornie-js/backend-user-adapter-typeorm';
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
