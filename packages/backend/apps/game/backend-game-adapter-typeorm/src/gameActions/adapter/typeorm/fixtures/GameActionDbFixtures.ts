/* eslint-disable @typescript-eslint/no-misused-spread */
import { GameDbFixtures } from '../../../../games/adapter/typeorm/fixtures/GameDbFixtures';
import { GameDb } from '../../../../games/adapter/typeorm/models/GameDb';
import { GameActionDb } from '../models/GameActionDb';
import { GameActionDbPayloadV1Fixtures } from './GameActionDbPayloadV1Fixtures';

export class GameActionDbFixtures {
  public static get any(): GameActionDb {
    const gameDbFixture: GameDb =
      GameDbFixtures.withStatusActiveAndGameSlotsOne;

    return {
      currentPlayingSlotIndex: 0,
      game: gameDbFixture,
      gameId: gameDbFixture.id,
      id: '20f00a2b-bc9f-47fd-afb2-c2ed1b60e1b3',
      payload: JSON.stringify(GameActionDbPayloadV1Fixtures.any),
      position: 0,
      turn: 1,
    };
  }

  public static get withGameActive(): GameActionDb {
    const gameDbFixture: GameDb =
      GameDbFixtures.withStatusActiveAndGameSlotsOne;

    return {
      ...GameActionDbFixtures.any,
      game: gameDbFixture,
    };
  }

  public static get withPayloadWithKindDrawCardsAndCardsOne(): GameActionDb {
    return {
      ...GameActionDbFixtures.any,
      payload: JSON.stringify(
        GameActionDbPayloadV1Fixtures.withKindDrawCardsAndCardsOne,
      ),
    };
  }

  public static get withPayloadWithKindPassTurn(): GameActionDb {
    return {
      ...GameActionDbFixtures.any,
      payload: JSON.stringify(GameActionDbPayloadV1Fixtures.withKindPassTurn),
    };
  }

  public static get withActiveGamePayloadWithKindPlayCardsAndCardsOne(): GameActionDb {
    return {
      ...GameActionDbFixtures.any,
      payload: JSON.stringify(
        GameActionDbPayloadV1Fixtures.withKindPlayCardsAndCardsOne,
      ),
    };
  }
}
