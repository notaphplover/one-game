import { Module } from '@nestjs/common';

import { GameDirectionV1FromGameDirectionBuilder } from '../../../application/builders/GameDirectionV1FromGameDirectionBuilder';

@Module({
  exports: [GameDirectionV1FromGameDirectionBuilder],
  providers: [GameDirectionV1FromGameDirectionBuilder],
})
export class GameDirectionApplicationModule {}
