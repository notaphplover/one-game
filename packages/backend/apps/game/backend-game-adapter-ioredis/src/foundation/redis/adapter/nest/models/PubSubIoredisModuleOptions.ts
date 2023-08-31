import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export interface PubSubIoredisModuleOptions {
  imports?: Array<
    Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => RedisOptions;
}
