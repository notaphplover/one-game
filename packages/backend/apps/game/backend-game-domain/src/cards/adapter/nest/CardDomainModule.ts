import { Module } from '@nestjs/common';

import { AreCardsEqualsSpec } from '../../domain/specs/AreCardsEqualsSpec';

@Module({
  exports: [AreCardsEqualsSpec],
  providers: [AreCardsEqualsSpec],
})
export class CardDomainModule {}
