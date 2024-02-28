import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import {
  GameCardSpec,
  GameDirection,
} from '@cornie-js/backend-game-domain/games';
import { GameCardSpecFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import {
  GameInitialSnapshot,
  GameInitialSnapshotSlot,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import { GameInitialSnapshotSlotFixtures } from '@cornie-js/backend-game-domain/gameSnapshots/fixtures';

import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDirectionDb } from '../../../../games/adapter/typeorm/models/GameDirectionDb';
import { GameInitialSnapshotDbFixtures } from '../fixtures/GameInitialSnapshotDbFixtures';
import { GameInitialSnapshotDb } from '../models/GameInitialSnapshotDb';
import { GameInitialSnapshotSlotDb } from '../models/GameInitialSnapshotSlotDb';
import { GameInitialSnapshotFromGameInitialSnapshotDbBuilder } from './GameInitialSnapshotFromGameInitialSnapshotDbBuilder';

describe(GameInitialSnapshotFromGameInitialSnapshotDbBuilder.name, () => {
  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;
  let cardColorBuilderMock: jest.Mocked<Builder<CardColor, [CardColorDb]>>;
  let gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock: jest.Mocked<
    Builder<GameCardSpec[], [string]>
  >;
  let gameDirectionFromGameDirectionDbBuilderMock: jest.Mocked<
    Builder<GameDirection, [GameDirectionDb]>
  >;
  let gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilderMock: jest.Mocked<
    Builder<GameInitialSnapshotSlot, [GameInitialSnapshotSlotDb]>
  >;

  let gameInitialSnapshotFromGameInitialSnapshotDbBuilder: GameInitialSnapshotFromGameInitialSnapshotDbBuilder;

  beforeAll(() => {
    cardBuilderMock = {
      build: jest.fn(),
    };
    cardColorBuilderMock = {
      build: jest.fn(),
    };
    gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock = {
      build: jest.fn(),
    };
    gameDirectionFromGameDirectionDbBuilderMock = {
      build: jest.fn(),
    };
    gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilderMock = {
      build: jest.fn(),
    };

    gameInitialSnapshotFromGameInitialSnapshotDbBuilder =
      new GameInitialSnapshotFromGameInitialSnapshotDbBuilder(
        cardBuilderMock,
        cardColorBuilderMock,
        gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock,
        gameDirectionFromGameDirectionDbBuilderMock,
        gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilderMock,
      );
  });

  describe('.build', () => {
    let gameInitialSnapshotDbFixture: GameInitialSnapshotDb;

    beforeAll(() => {
      gameInitialSnapshotDbFixture =
        GameInitialSnapshotDbFixtures.withGameSlotsOne;
    });

    describe('when called', () => {
      let cardColorFixture: CardColor;
      let cardFixture: Card;
      let gameCardSpecArrayFixture: GameCardSpec[];
      let gameDirectionFixture: GameDirection;
      let gameInitialSnapshotSlotFixture: GameInitialSnapshotSlot;

      let result: unknown;

      beforeAll(() => {
        cardColorFixture = CardColor.blue;
        cardFixture = CardFixtures.any;
        gameDirectionFixture = GameDirection.clockwise;
        gameCardSpecArrayFixture = [GameCardSpecFixtures.any];
        gameInitialSnapshotSlotFixture = GameInitialSnapshotSlotFixtures.any;

        cardBuilderMock.build.mockReturnValueOnce(cardFixture);
        cardColorBuilderMock.build.mockReturnValueOnce(cardColorFixture);
        gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build.mockReturnValueOnce(
          gameCardSpecArrayFixture,
        );
        gameDirectionFromGameDirectionDbBuilderMock.build.mockReturnValueOnce(
          gameDirectionFixture,
        );
        gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilderMock.build.mockReturnValueOnce(
          gameInitialSnapshotSlotFixture,
        );

        result = gameInitialSnapshotFromGameInitialSnapshotDbBuilder.build(
          gameInitialSnapshotDbFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cardBuilder.build()', () => {
        expect(cardBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(cardBuilderMock.build).toHaveBeenCalledWith(
          gameInitialSnapshotDbFixture.currentCard,
        );
      });

      it('should call cardColorBuilder.build()', () => {
        expect(cardColorBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(cardColorBuilderMock.build).toHaveBeenCalledWith(
          gameInitialSnapshotDbFixture.currentColor,
        );
      });

      it('should call gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build()', () => {
        expect(
          gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameCardSpecArrayFromGameCardSpecArrayDbBuilderMock.build,
        ).toHaveBeenCalledWith(gameInitialSnapshotDbFixture.deck);
      });

      it('should call gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder.build()', () => {
        expect(
          gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilderMock.build,
        ).toHaveBeenCalledWith(gameInitialSnapshotDbFixture.gameSlotsDb[0]);
      });

      it('should return GameInitialSnapshot', () => {
        const expected: GameInitialSnapshot = {
          currentCard: cardFixture,
          currentColor: cardColorFixture,
          currentDirection: gameDirectionFixture,
          currentPlayingSlotIndex:
            gameInitialSnapshotDbFixture.currentPlayingSlotIndex,
          deck: gameCardSpecArrayFixture,
          drawCount: gameInitialSnapshotDbFixture.drawCount,
          id: gameInitialSnapshotDbFixture.id,
          slots: [gameInitialSnapshotSlotFixture],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
