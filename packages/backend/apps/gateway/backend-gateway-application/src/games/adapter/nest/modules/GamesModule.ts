import { Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { batchedGetSpecByGameIdHandlerBuilderSymbol } from '../../../application/builders/batchedGetSpecByGameIdHandlerBuilderSymbol';
import { GameGraphQlFromGameV1Builder } from '../../../application/builders/GameGraphQlFromGameV1Builder';
import { GameSpecGraphqlFromGameSpecV1Builder } from '../../../application/builders/GameSpecGraphqlFromGameSpecV1Builder';
import { GameMutationResolver } from '../../../application/resolvers/GameMutationResolver';
import { GameQueryResolver } from '../../../application/resolvers/GameQueryResolver';
import { GameResolver } from '../../../application/resolvers/GameResolver';
import { BatchedGetSpecByGameIdHandlerBuilder } from '../../dataloader/builders/BatchedGetSpecByGameIdHandlerBuilder';

@Module({
  exports: [
    batchedGetSpecByGameIdHandlerBuilderSymbol,
    GameMutationResolver,
    GameResolver,
    GameQueryResolver,
  ],
  imports: [HttpApiModule],
  providers: [
    {
      provide: batchedGetSpecByGameIdHandlerBuilderSymbol,
      useClass: BatchedGetSpecByGameIdHandlerBuilder,
    },
    GameGraphQlFromGameV1Builder,
    GameMutationResolver,
    GameSpecGraphqlFromGameSpecV1Builder,
    GameResolver,
    GameQueryResolver,
  ],
})
export class GamesModule {}
