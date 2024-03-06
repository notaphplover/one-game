import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { Game } from '@cornie-js/backend-game-domain/games';

export interface GameUpdatedEvent {
  gameBeforeUpdate: Game;
  transactionWrapper: TransactionWrapper;
}
