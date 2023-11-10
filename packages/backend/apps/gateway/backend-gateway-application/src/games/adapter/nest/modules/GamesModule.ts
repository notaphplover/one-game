import { Module } from '@nestjs/common';

import { HttpApiModule } from '../../../../foundation/api/adapter/nest/modules/HttpApiModule';
import { GameGraphQlFromGameV1Builder } from '../../../application/builders/GameGraphQlFromGameV1Builder';
import { GameMutationResolver } from '../../../application/resolvers/GameMutationResolver';

@Module({
  exports: [GameMutationResolver],
  imports: [HttpApiModule],
  providers: [GameGraphQlFromGameV1Builder, GameMutationResolver],
})
export class GamesModule {}
