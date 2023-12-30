import { EnvModule, EnvironmentService } from '@cornie-js/backend-app-game-env';
import { DbModuleOptions } from '@cornie-js/backend-game-adapter-typeorm';
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
