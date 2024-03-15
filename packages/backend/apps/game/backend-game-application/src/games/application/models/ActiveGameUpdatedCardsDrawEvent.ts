import { Card } from '@cornie-js/backend-game-domain/cards';

import { ActiveGameUpdatedEventKind } from './ActiveGameUpdatedEventKind';
import { BaseActiveGameUpdatedEvent } from './BaseActiveGameUpdatedEvent';

export interface ActiveGameUpdatedCardsDrawEvent
  extends BaseActiveGameUpdatedEvent<ActiveGameUpdatedEventKind.cardsDraw> {
  draw: Card[];
}
