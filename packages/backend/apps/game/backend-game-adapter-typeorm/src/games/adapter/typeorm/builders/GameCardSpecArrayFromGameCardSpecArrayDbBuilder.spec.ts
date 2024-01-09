import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';
import { GameCardSpec } from '@cornie-js/backend-game-domain/games';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameCardSpecArrayFromGameCardSpecArrayDbBuilder } from './GameCardSpecArrayFromGameCardSpecArrayDbBuilder';

describe(GameCardSpecArrayFromGameCardSpecArrayDbBuilder.name, () => {
  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;

  let gameCardSpecArrayFromGameCardSpecArrayDbBuilder: GameCardSpecArrayFromGameCardSpecArrayDbBuilder;

  beforeAll(() => {
    cardBuilderMock = {
      build: jest.fn(),
    };

    gameCardSpecArrayFromGameCardSpecArrayDbBuilder =
      new GameCardSpecArrayFromGameCardSpecArrayDbBuilder(cardBuilderMock);
  });

  describe('.build', () => {
    describe('having a non serialized JSON string', () => {
      let gameCardSpecArrayFixture: string;

      beforeAll(() => {
        gameCardSpecArrayFixture = '[)';
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build(
              gameCardSpecArrayFixture,
            );
          } catch (error) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an AppError', () => {
          const expectedProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: 'Unexpected malformed card spec db entry',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having an invalid game card spec array serialized JSON string', () => {
      let gameCardSpecArrayFixture: string;

      beforeAll(() => {
        gameCardSpecArrayFixture = JSON.stringify({ foo: 'bar' });
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build(
              gameCardSpecArrayFixture,
            );
          } catch (error) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should throw an AppError', () => {
          const expectedProperties: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: 'Unexpected card spec db entry',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedProperties),
          );
        });
      });
    });

    describe('having a valid game card spec array serialized JSON string', () => {
      let gameCardSpecDbFixture: GameCardSpecDb;
      let gameCardSpecArrayFixture: string;

      beforeAll(() => {
        gameCardSpecDbFixture = {
          amount: 1,
          card: 39,
        };

        gameCardSpecArrayFixture = JSON.stringify([gameCardSpecDbFixture]);
      });

      describe('when called', () => {
        let cardFixture: Card;

        let result: unknown;

        beforeAll(() => {
          cardFixture = CardFixtures.any;

          cardBuilderMock.build.mockReturnValueOnce(cardFixture);

          result = gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build(
            gameCardSpecArrayFixture,
          );
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

        it('should return GameCardSpec[]', () => {
          const expected: GameCardSpec[] = [
            {
              amount: gameCardSpecDbFixture.amount,
              card: cardFixture,
            },
          ];

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
