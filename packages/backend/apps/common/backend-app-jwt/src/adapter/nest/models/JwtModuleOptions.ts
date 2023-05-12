import { JwtServiceOptions } from '@cornie-js/backend-jwt';
import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';

export interface JwtModuleOptions {
  imports?: Array<
    Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => JwtServiceOptions;
}
