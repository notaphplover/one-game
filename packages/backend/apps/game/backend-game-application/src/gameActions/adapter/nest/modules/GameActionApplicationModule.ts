import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { GameActionManagementInputPort } from '../../../application/ports/input/GameActionManagementInputPort';

@Module({})
export class GameActionApplicationModule {
  public static forRootAsync(
    imports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [GameActionManagementInputPort],
      global: false,
      imports: [...(imports ?? [])],
      module: GameActionApplicationModule,
      providers: [GameActionManagementInputPort],
    };
  }
}
