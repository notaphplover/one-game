import { beforeAll, describe, expect, it } from '@jest/globals';

import { AppError, AppErrorKind } from '@cornie-js/backend-common';

import { GameMessageEventFromStringBuilder } from './GameMessageEventFromStringBuilder';

describe(GameMessageEventFromStringBuilder.name, () => {
  let gameMessageEventFromStringBuilder: GameMessageEventFromStringBuilder;

  beforeAll(() => {
    gameMessageEventFromStringBuilder = new GameMessageEventFromStringBuilder();
  });

  describe('.build', () => {
    describe('having an invalid stringified message event', () => {
      let stringifiedGameMessageEventFixture: string;

      beforeAll(() => {
        stringifiedGameMessageEventFixture = '{}';
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            gameMessageEventFromStringBuilder.build(
              stringifiedGameMessageEventFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an AppError', () => {
          const expected: Partial<AppError> = {
            kind: AppErrorKind.unknown,
            message: 'Unexpected invalid game message event',
          };

          expect(result).toBeInstanceOf(AppError);
          expect(result).toStrictEqual(expect.objectContaining(expected));
        });
      });
    });
  });
});
