import { ActiveGameUpdatedEventKind } from './ActiveGameUpdatedEventKind';
import { BaseActiveGameUpdatedEvent } from './BaseActiveGameUpdatedEvent';

export type ActiveGameUpdatedTurnPassEvent =
  BaseActiveGameUpdatedEvent<ActiveGameUpdatedEventKind.turnPass>;
