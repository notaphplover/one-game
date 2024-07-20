import { MessageSendOutputPort } from '@cornie-js/backend-application-messaging';

import { GameTurnEndSignalMessage } from '../../models/GameTurnEndSignalMessage';

export type GameTurnEndSignalMessageSendOutputPort =
  MessageSendOutputPort<GameTurnEndSignalMessage>;

export const gameTurnEndSignalMessageSendOutputPortSymbol: symbol = Symbol.for(
  'GameTurnEndSignalMessageSendOutputPort',
);
