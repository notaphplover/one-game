/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GameActionDbVersion } from '../models/GameActionDbVersion';
import { DrawCardsGameActionDbPayloadV1 } from '../models/v1/DrawCardsGameActionDbPayloadV1';
import { GameActionDbPayloadV1 } from '../models/v1/GameActionDbPayloadV1';
import { GameActionDbPayloadV1Kind } from '../models/v1/GameActionDbPayloadV1Kind';
import { PassTurnGameActionDbPayloadV1 } from '../models/v1/PassTurnGameActionDbPayloadV1';
import { PlayCardsGameActionDbPayloadV1 } from '../models/v1/PlayCardsGameActionDbPayloadV1';

export class GameActionDbPayloadV1Fixtures {
  public static get any(): GameActionDbPayloadV1 {
    return {
      kind: GameActionDbPayloadV1Kind.passTurn,
      version: GameActionDbVersion.v1,
    };
  }

  public static get withKindDrawCardsAndCardsOne(): DrawCardsGameActionDbPayloadV1 {
    return {
      draw: [0x0039],
      kind: GameActionDbPayloadV1Kind.draw,
      version: GameActionDbVersion.v1,
    };
  }

  public static get withKindPassTurn(): PassTurnGameActionDbPayloadV1 {
    return {
      kind: GameActionDbPayloadV1Kind.passTurn,
      version: GameActionDbVersion.v1,
    };
  }

  public static get withKindPlayCardsAndCardsOne(): PlayCardsGameActionDbPayloadV1 {
    return {
      cards: [0x0039],
      kind: GameActionDbPayloadV1Kind.playCards,
      version: GameActionDbVersion.v1,
    };
  }
}
