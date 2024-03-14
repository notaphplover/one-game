import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { ActiveGame } from '@cornie-js/backend-game-domain/games';

export interface GameUpdatedEvent {
  gameBeforeUpdate: ActiveGame;
  transactionWrapper: TransactionWrapper;
}
