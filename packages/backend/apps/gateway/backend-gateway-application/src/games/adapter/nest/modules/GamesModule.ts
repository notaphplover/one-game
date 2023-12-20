import { Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { batchedGetSpecByGameIdHandlerBuilderSymbol } from '../../../application/builders/batchedGetSpecByGameIdHandlerBuilderSymbol';
import { GameGraphQlFromGameV1Builder } from '../../../application/builders/GameGraphQlFromGameV1Builder';
import { GameSpecGraphqlFromGameSpecV1Builder } from '../../../application/builders/GameSpecGraphqlFromGameSpecV1Builder';
import { ActiveGameResolver } from '../../../application/resolvers/ActiveGameResolver';
import { FinishedGameResolver } from '../../../application/resolvers/FinishedGameResolver';
import { GameMutationResolver } from '../../../application/resolvers/GameMutationResolver';
import { GameQueryResolver } from '../../../application/resolvers/GameQueryResolver';
import { GameResolver } from '../../../application/resolvers/GameResolver';
import { NonStartedGameResolver } from '../../../application/resolvers/NonStartedGameResolver';
import { BatchedGetSpecByGameIdHandlerBuilder } from '../../dataloader/builders/BatchedGetSpecByGameIdHandlerBuilder';

@Module({
  exports: [
    ActiveGameResolver,
    batchedGetSpecByGameIdHandlerBuilderSymbol,
    FinishedGameResolver,
    GameMutationResolver,
    GameResolver,
    GameQueryResolver,
    NonStartedGameResolver,
  ],
  imports: [HttpApiModule],
  providers: [
    ActiveGameResolver,
    {
      provide: batchedGetSpecByGameIdHandlerBuilderSymbol,
      useClass: BatchedGetSpecByGameIdHandlerBuilder,
    },
    FinishedGameResolver,
    GameGraphQlFromGameV1Builder,
    GameMutationResolver,
    GameSpecGraphqlFromGameSpecV1Builder,
    GameResolver,
    GameQueryResolver,
    NonStartedGameResolver,
  ],
})
export class GamesModule {}
