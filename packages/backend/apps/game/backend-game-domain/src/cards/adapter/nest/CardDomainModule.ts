import { Module } from '@nestjs/common';

import { AreCardsEqualsSpec } from '../../domain/specs/AreCardsEqualsSpec';
import { CardRequiresColorChoiceSpec } from '../../domain/specs/CardRequiresColorChoiceSpec';
import { IsValidInitialCardSpec } from '../../domain/specs/IsValidInitialCardSpec';

@Module({
  exports: [
    AreCardsEqualsSpec,
    CardRequiresColorChoiceSpec,
    IsValidInitialCardSpec,
  ],
  providers: [
    AreCardsEqualsSpec,
    CardRequiresColorChoiceSpec,
    IsValidInitialCardSpec,
  ],
})
export class CardDomainModule {}
