import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { CardModule } from '../../../../cards/adapter/nest/modules/CardModule';
import { GameDirectionApplicationModule } from '../../../../games/adapter/nest/modules/GameDirectionApplicationModule';
import { GameEventV2FromGameActionBuilder } from '../../../application/builders/GameEventV2FromGameActionBuilder';
import { MessageEventFromGameActionBuilder } from '../../../application/builders/MessageEventFromGameActionBuilder';
import { GameActionManagementInputPort } from '../../../application/ports/input/GameActionManagementInputPort';

@Module({})
export class GameActionApplicationModule {
  public static forRootAsync(
    imports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [
        GameActionManagementInputPort,
        GameEventV2FromGameActionBuilder,
      ],
      global: false,
      imports: [...(imports ?? []), CardModule, GameDirectionApplicationModule],
      module: GameActionApplicationModule,
      providers: [
        GameActionManagementInputPort,
        GameEventV2FromGameActionBuilder,
        MessageEventFromGameActionBuilder,
      ],
    };
  }
}
