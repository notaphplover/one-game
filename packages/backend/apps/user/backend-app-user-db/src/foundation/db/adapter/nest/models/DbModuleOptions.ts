import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DbModuleOptions {
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
