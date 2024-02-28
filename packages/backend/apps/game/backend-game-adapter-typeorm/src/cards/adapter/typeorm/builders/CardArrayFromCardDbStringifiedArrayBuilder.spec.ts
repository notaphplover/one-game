import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { CardFixtures } from '@cornie-js/backend-game-domain/cards/fixtures';

import { CardDb } from '../models/CardDb';
import { CardArrayFromCardDbStringifiedArrayBuilder } from './CardArrayFromCardDbStringifiedArrayBuilder';

describe(CardArrayFromCardDbStringifiedArrayBuilder.name, () => {
  let cardBuilderMock: jest.Mocked<Builder<Card, [CardDb]>>;

  let cardArrayFromCardDbStringifiedArrayBuilder: CardArrayFromCardDbStringifiedArrayBuilder;

  beforeAll(() => {
    cardBuilderMock = {
      build: jest.fn(),
    };

    cardArrayFromCardDbStringifiedArrayBuilder =
      new CardArrayFromCardDbStringifiedArrayBuilder(cardBuilderMock);
  });

  describe('.build', () => {
    describe.each<[string, string, Partial<AppError>]>([
      [
        'a non JSON',
        '[',
        {
          kind: AppErrorKind.unknown,
          message: 'Unexpected error parsing cards JSON array',
        },
      ],
      [
        'a non JSON array',
        '{}',
        {
          kind: AppErrorKind.unknown,
          message: 'Unexpected game slot cards JSON value',
        },
      ],
      [
        'a non JSON number array',
        '[3, "4"]',
        {
          kind: AppErrorKind.unknown,
          message: 'Unexpected game slot cards JSON value',
        },
      ],
    ])(
      'having %s input',
      (
        _: string,
        stringifiedCardsFixture: string,
        expectedErrorProperties: Partial<AppError>,
      ) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            try {
              cardArrayFromCardDbStringifiedArrayBuilder.build(
                stringifiedCardsFixture,
              );
            } catch (error: unknown) {
              result = error;
            }
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should throw an AppError', () => {
            expect(result).toBeInstanceOf(AppError);
            expect(result).toStrictEqual(
              expect.objectContaining(expectedErrorProperties),
            );
          });
        });
      },
    );

    describe('having a stringified JSON cards array', () => {
      let cardDbFixture: number;
      let stringifiedCardsFixture: string;

      beforeAll(() => {
        cardDbFixture = 39;
        stringifiedCardsFixture = `[${cardDbFixture}]`;
      });

      describe('when called', () => {
        let cardFixture: Card;

        let result: unknown;

        beforeAll(() => {
          cardFixture = CardFixtures.any;

          cardBuilderMock.build.mockReturnValueOnce(cardFixture);

          result = cardArrayFromCardDbStringifiedArrayBuilder.build(
            stringifiedCardsFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardBuilder.build()', () => {
          expect(cardBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(cardBuilderMock.build).toHaveBeenCalledWith(cardDbFixture);
        });

        it('should return Card array', () => {
          expect(result).toStrictEqual([cardFixture]);
        });
      });
    });
  });
});
