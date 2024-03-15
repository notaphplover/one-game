import { Card } from '@cornie-js/backend-game-domain/cards';

import { ActiveGameUpdatedEventKind } from './ActiveGameUpdatedEventKind';
import { BaseActiveGameUpdatedEvent } from './BaseActiveGameUpdatedEvent';

export interface ActiveGameUpdatedCardsPlayEvent
  extends BaseActiveGameUpdatedEvent<ActiveGameUpdatedEventKind.cardsPlay> {
  cards: Card[];
}
