import { TransactionWrapper } from '@cornie-js/backend-db/application';
import { ActiveGame } from '@cornie-js/backend-game-domain/games';

import { ActiveGameUpdatedEventKind } from './ActiveGameUpdatedEventKind';

export interface BaseActiveGameUpdatedEvent<
  TKind extends ActiveGameUpdatedEventKind,
> {
  gameBeforeUpdate: ActiveGame;
  kind: TKind;
  transactionWrapper: TransactionWrapper;
}
