import { Module } from '@nestjs/common';

import { AreCardsEqualsSpec } from '../../domain/specs/AreCardsEqualsSpec';
import { IsValidInitialCardSpec } from '../../domain/specs/IsValidInitialCardSpec';

@Module({
  exports: [AreCardsEqualsSpec, IsValidInitialCardSpec],
  providers: [AreCardsEqualsSpec, IsValidInitialCardSpec],
})
export class CardDomainModule {}
