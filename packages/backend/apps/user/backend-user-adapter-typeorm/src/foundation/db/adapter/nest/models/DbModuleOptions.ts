import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm';

export interface DbModuleOptions {
  /*
   * Due to the poor design of the Nest core (https://docs.nestjs.com/faq/common-errors#cannot-resolve-dependency-error)
   * a single package should be providing dynamic module builders so there's no chance
   * of having a dependency hell issue. Since this package is designed to be used by other ones,
   * the current approach is requiring a dynamic module builder, which should be provided by the
   * bootstrap package.
   */
  builders: {
    feature: (
      // eslint-disable-next-line @typescript-eslint/ban-types
      entities?: (Function | EntitySchema)[],
      dataSource?: DataSource | DataSourceOptions | string,
    ) => DynamicModule;
    root: (options: TypeOrmModuleAsyncOptions) => DynamicModule;
  };
  imports?: (
    | DynamicModule
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Type<any>
    | Promise<DynamicModule>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ForwardReference<any>
  )[];
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions;
}
