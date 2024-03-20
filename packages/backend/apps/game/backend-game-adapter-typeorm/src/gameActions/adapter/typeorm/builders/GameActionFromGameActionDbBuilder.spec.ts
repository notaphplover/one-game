import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import {
  GameAction,
  GameActionKind,
} from '@cornie-js/backend-game-domain/gameActions';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameActionDbFixtures } from '../fixtures/GameActionDbFixtures';
import { GameActionDb } from '../models/GameActionDb';
import { GameActionFromGameActionDbBuilder } from './GameActionFromGameActionDbBuilder';

describe(GameActionFromGameActionDbBuilder.name, () => {
  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;

  let gameActionFromGameActionDbBuilder: GameActionFromGameActionDbBuilder;

  beforeAll(() => {
    cardBuilderMock = {
      build: jest.fn(),
    };

    cardBuilderMock.build.mockReturnValue(CardFixtures.any);

    gameActionFromGameActionDbBuilder = new GameActionFromGameActionDbBuilder(
      cardBuilderMock,
    );
  });

  describe('.build', () => {
    describe.each<[string, GameActionDb, () => GameAction]>([
      [
        'draw cards v1',
        GameActionDbFixtures.withPayloadWithKindDrawCardsAndCardsOne,
        (): GameAction => {
          const gameActionDbFixture: GameActionDb =
            GameActionDbFixtures.withPayloadWithKindDrawCardsAndCardsOne;

          return {
            currentPlayingSlotIndex:
              gameActionDbFixture.currentPlayingSlotIndex,
            draw: [CardFixtures.any],
            gameId: gameActionDbFixture.gameId,
            id: gameActionDbFixture.id,
            kind: GameActionKind.draw,
            position: gameActionDbFixture.position,
            turn: gameActionDbFixture.turn,
          };
        },
      ],
      [
        'pass turn v1',
        GameActionDbFixtures.withPayloadWithKindPassTurn,
        (): GameAction => {
          const gameActionDbFixture: GameActionDb =
            GameActionDbFixtures.withPayloadWithKindPassTurn;

          return {
            currentPlayingSlotIndex:
              gameActionDbFixture.currentPlayingSlotIndex,
            gameId: gameActionDbFixture.gameId,
            id: gameActionDbFixture.id,
            kind: GameActionKind.passTurn,
            position: gameActionDbFixture.position,
            turn: gameActionDbFixture.turn,
          };
        },
      ],
      [
        'play cards v1',
        GameActionDbFixtures.withPayloadWithKindPlayCardsAndCardsOne,
        (): GameAction => {
          const gameActionDbFixture: GameActionDb =
            GameActionDbFixtures.withPayloadWithKindPlayCardsAndCardsOne;

          return {
            cards: [CardFixtures.any],
            currentPlayingSlotIndex:
              gameActionDbFixture.currentPlayingSlotIndex,
            gameId: gameActionDbFixture.gameId,
            id: gameActionDbFixture.id,
            kind: GameActionKind.playCards,
            position: gameActionDbFixture.position,
            turn: gameActionDbFixture.turn,
          };
        },
      ],
    ])(
      'having a %s GameActionDb',
      (
        _: string,
        gameActionDbFixture: GameActionDb,
        buildExpectedGameAction: () => GameAction,
      ) => {
        let expectedGameAction: GameAction;

        let result: unknown;

        beforeAll(() => {
          expectedGameAction = buildExpectedGameAction();

          result = gameActionFromGameActionDbBuilder.build(gameActionDbFixture);
        });

        it('should return GameAction', () => {
          expect(result).toStrictEqual(expectedGameAction);
        });
      },
    );
  });
});
