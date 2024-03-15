import { ActiveGameUpdatedCardsDrawEvent } from './ActiveGameUpdatedCardsDrawEvent';
import { ActiveGameUpdatedCardsPlayEvent } from './ActiveGameUpdatedCardsPlayEvent';
import { ActiveGameUpdatedTurnPassEvent } from './ActiveGameUpdatedTurnPassEvent';

export type ActiveGameUpdatedEvent =
  | ActiveGameUpdatedCardsDrawEvent
  | ActiveGameUpdatedCardsPlayEvent
  | ActiveGameUpdatedTurnPassEvent;
