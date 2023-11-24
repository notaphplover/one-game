import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import { GameSpec } from '@cornie-js/backend-game-domain/games';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameSpecDbFixtures } from '../fixtures/GameSpecDbFixtures';
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameSpecDb } from '../models/GameSpecDb';
import { GameSpecFromGameSpecDbBuilder } from './GameSpecFromGameSpecDbBuilder';

describe(GameSpecFromGameSpecDbBuilder.name, () => {
  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;

  let gameSpecFromGameSpecDbBuilder: GameSpecFromGameSpecDbBuilder;

  beforeAll(() => {
    cardBuilderMock = {
      build: jest.fn(),
    };

    gameSpecFromGameSpecDbBuilder = new GameSpecFromGameSpecDbBuilder(
      cardBuilderMock,
    );
  });

  describe('having a valid GameSpecDb with a card', () => {
    let gameCardSpecDbFixture: GameCardSpecDb;
    let gameSpecDbFixture: GameSpecDb;

    beforeAll(() => {
      gameSpecDbFixture = GameSpecDbFixtures.withCardSpecWithOne;

      [gameCardSpecDbFixture] = JSON.parse(gameSpecDbFixture.cardsSpec) as [
        GameCardSpecDb,
      ];
    });

    describe('when called', () => {
      let cardFixture: Card;

      beforeAll(() => {
        cardFixture = CardFixtures.any;
      });

      let result: unknown;

      beforeAll(() => {
        cardBuilderMock.build.mockReturnValueOnce(cardFixture);

        result = gameSpecFromGameSpecDbBuilder.build(gameSpecDbFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cardBuilder.build()', () => {
        expect(cardBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(cardBuilderMock.build).toHaveBeenCalledWith(
          gameCardSpecDbFixture.card,
        );
      });

      it('should return a GameSpec', () => {
        const expected: GameSpec = {
          cards: [
            {
              amount: gameCardSpecDbFixture.amount,
              card: cardFixture,
            },
          ],
          gameSlotsAmount: gameSpecDbFixture.gameSlotsAmount,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
