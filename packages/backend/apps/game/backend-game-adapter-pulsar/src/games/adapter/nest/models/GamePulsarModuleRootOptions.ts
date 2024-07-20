import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

export interface GamePulsarModuleRootOptions {
  imports?: (
    | DynamicModule
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Type<any>
    | Promise<DynamicModule>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ForwardReference<any>
  )[];
  provide: {
    consumers: boolean;
    producers: boolean;
  };
}
