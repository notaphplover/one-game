import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-user-env';
import { DbModuleOptions } from '@cornie-js/backend-user-adapter-typeorm';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export function buildDbModuleOptions(): DbModuleOptions {
  return {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    builder: TypeOrmModule.forRootAsync,
    imports: [EnvModule],
    inject: [EnvironmentService],
    useFactory: (
      environmentService: EnvironmentService,
    ): TypeOrmModuleOptions =>
      environmentService.getEnvironment().typeOrmDatasourceOptions,
  };
}
