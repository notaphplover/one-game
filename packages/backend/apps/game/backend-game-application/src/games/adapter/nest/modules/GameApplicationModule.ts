import { UuidModule } from '@cornie-js/backend-app-uuid';
import { GameDomainModule } from '@cornie-js/backend-game-domain';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';

import { CardModule } from '../../../../cards/adapter/nest/modules/CardModule';
import { ActiveGameSlotV1FromActiveGameSlotBuilder } from '../../../application/builders/ActiveGameSlotV1FromActiveGameSlotBuilder';
import { FinishedGameSlotV1FromFinishedGameSlotBuilder } from '../../../application/builders/FinishedGameSlotV1FromFinishedGameSlotBuilder';
import { GameCardSpecFromGameCardSpecV1Builder } from '../../../application/builders/GameCardSpecFromGameCardSpecV1Builder';
import { GameCardSpecsFromGameSpecV1Builder } from '../../../application/builders/GameCardSpecsFromGameSpecV1Builder';
import { GameCardSpecV1FromGameCardSpecBuilder } from '../../../application/builders/GameCardSpecV1FromGameCardSpecBuilder';
import { GameCreateQueryFromGameCreateQueryV1Builder } from '../../../application/builders/GameCreateQueryFromGameCreateQueryV1Builder';
import { GameDirectionV1FromGameDirectionBuilder } from '../../../application/builders/GameDirectionV1FromGameDirectionBuilder';
import { GameMessageEventV1FromGameMessageEventBuilder } from '../../../application/builders/GameMessageEventV1FromGameMessageEventBuilder';
import { GameOptionsCreateQueryFromGameOptionsV1Builder } from '../../../application/builders/GameOptionsCreateQueryFromGameOptionsV1Builder';
import { GameOptionsV1FromGameOptionsBuilder } from '../../../application/builders/GameOptionsV1FromGameOptionsBuilder';
import { GameSlotCreateQueryFromGameSlotCreateQueryV1Builder } from '../../../application/builders/GameSlotCreateQueryFromGameSlotCreateQueryV1Builder';
import { GameSlotV1FromGameSlotBuilder } from '../../../application/builders/GameSlotV1FromGameSlotBuilder';
import { GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder } from '../../../application/builders/GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder';
import { GameSpecV1FromGameSpecBuilder } from '../../../application/builders/GameSpecV1FromGameSpecBuilder';
import { GameV1FromGameBuilder } from '../../../application/builders/GameV1FromGameBuilder';
import { MessageEventFromStringifiedGameMessageEventBuilder } from '../../../application/builders/MessageEventFromStringifiedGameMessageEventBuilder';
import { NonStartedGameSlotV1FromNonStartedGameSlotBuilder } from '../../../application/builders/NonStartedGameSlotV1FromNonStartedGameSlotBuilder';
import { GameCreatedEventHandler } from '../../../application/handlers/GameCreatedEventHandler';
import { GameIdPassTurnQueryV1Handler } from '../../../application/handlers/GameIdPassTurnQueryV1Handler';
import { GameIdPlayCardsQueryV1Handler } from '../../../application/handlers/GameIdPlayCardsQueryV1Handler';
import { GameUpdatedEventHandler } from '../../../application/handlers/GameUpdatedEventHandler';
import { NonStartedGameFilledEventHandler } from '../../../application/handlers/NonStartedGameFilledEventHandler';
import { GameEventsManagementInputPort } from '../../../application/ports/input/GameEventsManagementInputPort';
import { GameManagementInputPort } from '../../../application/ports/input/GameManagementInputPort';
import { GameSlotManagementInputPort } from '../../../application/ports/input/GameSlotManagementInputPort';
import { GameSpecManagementInputPort } from '../../../application/ports/input/GameSpecManagementInputPort';

@Module({})
export class GameApplicationModule {
  public static forRootAsync(
    imports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    return {
      exports: [
        GameEventsManagementInputPort,
        GameManagementInputPort,
        GameSlotManagementInputPort,
        GameSpecManagementInputPort,
      ],
      global: false,
      imports: [...(imports ?? []), GameDomainModule, UuidModule, CardModule],
      module: GameApplicationModule,
      providers: [
        ActiveGameSlotV1FromActiveGameSlotBuilder,
        FinishedGameSlotV1FromFinishedGameSlotBuilder,
        GameCardSpecFromGameCardSpecV1Builder,
        GameCardSpecsFromGameSpecV1Builder,
        GameCardSpecV1FromGameCardSpecBuilder,
        GameCreatedEventHandler,
        GameCreateQueryFromGameCreateQueryV1Builder,
        GameCreateQueryFromGameCreateQueryV1Builder,
        GameDirectionV1FromGameDirectionBuilder,
        GameEventsManagementInputPort,
        GameIdPassTurnQueryV1Handler,
        GameIdPlayCardsQueryV1Handler,
        GameManagementInputPort,
        GameMessageEventV1FromGameMessageEventBuilder,
        GameOptionsCreateQueryFromGameOptionsV1Builder,
        GameOptionsV1FromGameOptionsBuilder,
        GameSlotManagementInputPort,
        GameSpecManagementInputPort,
        GameSpecV1FromGameSpecBuilder,
        GameSlotCreateQueryFromGameSlotCreateQueryV1Builder,
        GameSlotV1FromGameSlotBuilder,
        GameSpecFindQuerySortOptionFromGameSpecSortOptionV1Builder,
        GameUpdatedEventHandler,
        GameV1FromGameBuilder,
        MessageEventFromStringifiedGameMessageEventBuilder,
        NonStartedGameFilledEventHandler,
        NonStartedGameSlotV1FromNonStartedGameSlotBuilder,
      ],
    };
  }
}
