import { Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { GameGraphQlFromGameV1Builder } from '../../../application/builders/GameGraphQlFromGameV1Builder';
import { GameMutationResolver } from '../../../application/resolvers/GameMutationResolver';
import { GameQueryResolver } from '../../../application/resolvers/GameQueryResolver';
import { GameResolver } from '../../../application/resolvers/GameResolver';

@Module({
  exports: [GameMutationResolver, GameResolver, GameQueryResolver],
  imports: [HttpApiModule],
  providers: [
    GameGraphQlFromGameV1Builder,
    GameMutationResolver,
    GameResolver,
    GameQueryResolver,
  ],
})
export class GamesModule {}
