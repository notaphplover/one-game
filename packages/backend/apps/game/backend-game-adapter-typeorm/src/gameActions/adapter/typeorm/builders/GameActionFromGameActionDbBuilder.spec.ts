import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import {
  GameAction,
  GameActionKind,
} from '@cornie-js/backend-game-domain/gameActions';
import { GameDirection } from '@cornie-js/backend-game-domain/games';

import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDirectionDb } from '../../../../games/adapter/typeorm/models/GameDirectionDb';
import { GameActionDbFixtures } from '../fixtures/GameActionDbFixtures';
import { GameActionDb } from '../models/GameActionDb';
import { GameActionFromGameActionDbBuilder } from './GameActionFromGameActionDbBuilder';

describe(GameActionFromGameActionDbBuilder.name, () => {
  let cardFixture: Card;
  let cardColorFixture: CardColor;
  let gameDirectionFixture: GameDirection;

  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;
  let cardColorBuilderMock: jest.Mocked<Builder<CardColor, [CardColorDb]>>;
  let gameDirectionFromGameDirectionDbBuilderMock: jest.Mocked<
    Builder<GameDirection, [GameDirectionDb]>
  >;

  let gameActionFromGameActionDbBuilder: GameActionFromGameActionDbBuilder;

  beforeAll(() => {
    cardFixture = CardFixtures.any;
    cardColorFixture = CardColor.blue;
    gameDirectionFixture = GameDirection.antiClockwise;

    cardBuilderMock = {
      build: jest.fn(),
    };
    cardColorBuilderMock = {
      build: jest.fn(),
    };
    gameDirectionFromGameDirectionDbBuilderMock = {
      build: jest.fn(),
    };

    cardBuilderMock.build.mockReturnValue(cardFixture);
    cardColorBuilderMock.build.mockReturnValue(cardColorFixture);
    gameDirectionFromGameDirectionDbBuilderMock.build.mockReturnValue(
      gameDirectionFixture,
    );

    gameActionFromGameActionDbBuilder = new GameActionFromGameActionDbBuilder(
      cardBuilderMock,
      cardColorBuilderMock,
      gameDirectionFromGameDirectionDbBuilderMock,
    );
  });

  afterAll(() => {
    cardBuilderMock.build.mockReset();
    cardColorBuilderMock.build.mockReset();
    gameDirectionFromGameDirectionDbBuilderMock.build.mockReset();
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
            draw: [cardFixture],
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
            nextPlayingSlotIndex: 1,
            position: gameActionDbFixture.position,
            turn: gameActionDbFixture.turn,
          };
        },
      ],
      [
        'play cards v1',
        GameActionDbFixtures.withActiveGamePayloadWithKindPlayCardsAndCardsOne,
        (): GameAction => {
          const gameActionDbFixture: GameActionDb =
            GameActionDbFixtures.withActiveGamePayloadWithKindPlayCardsAndCardsOne;

          return {
            cards: [cardFixture],
            currentPlayingSlotIndex:
              gameActionDbFixture.currentPlayingSlotIndex,
            gameId: gameActionDbFixture.gameId,
            id: gameActionDbFixture.id,
            kind: GameActionKind.playCards,
            position: gameActionDbFixture.position,
            stateUpdate: {
              currentCard: cardFixture,
              currentColor: cardColorFixture,
              currentDirection: gameDirectionFixture,
              drawCount: gameActionDbFixture.game.drawCount as number,
            },
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
