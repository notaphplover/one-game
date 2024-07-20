import { MessageSendPulsarAdapter } from '@cornie-js/backend-adapter-pulsar';
import {
  GameTurnEndSignalMessage,
  GameTurnEndSignalMessageSendOutputPort,
} from '@cornie-js/backend-game-application/games';
import { Inject, Injectable } from '@nestjs/common';
import { Producer } from 'pulsar-client';

import { gameTurnEndSignalProducerSymbol } from '../../nest/models/gameTurnEndSignalProducerSymbol';

@Injectable()
export class GameTurnEndSignalMessageSendPulsarAdapter
  extends MessageSendPulsarAdapter<GameTurnEndSignalMessage>
  implements GameTurnEndSignalMessageSendOutputPort
{
  constructor(
    @Inject(gameTurnEndSignalProducerSymbol)
    producer: Producer,
  ) {
    super(producer);
  }
}
