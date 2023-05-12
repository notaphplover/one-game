import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
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
  inject?: unknown[];
  useFactory: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions;
}
