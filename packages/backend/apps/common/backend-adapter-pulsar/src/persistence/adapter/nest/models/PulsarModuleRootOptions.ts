import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';

import { PulsarClientOptions } from '../../pulsar/models/PulsarClientOptions';

export interface PulsarModuleRootOptions {
  imports?: (
    | DynamicModule
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Type<any>
    | Promise<DynamicModule>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ForwardReference<any>
  )[];
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  provide: {
    consumers: boolean;
    producers: boolean;
  };
  useFactory: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<PulsarClientOptions> | PulsarClientOptions;
}
