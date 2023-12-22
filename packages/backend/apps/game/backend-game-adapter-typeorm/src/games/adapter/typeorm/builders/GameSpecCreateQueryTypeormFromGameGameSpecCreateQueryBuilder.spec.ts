import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import {
  GameCardSpec,
  GameSpecCreateQuery,
} from '@cornie-js/backend-game-domain/games';
import { GameSpecCreateQueryFixtures } from '@cornie-js/backend-game-domain/games/fixtures';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { GameSpecDb } from '../models/GameSpecDb';
import { GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder } from './GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder';

describe(
  GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder.name,
  () => {
    let gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock: jest.Mocked<
      Builder<string, [GameCardSpec[]]>
    >;

    let gameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder: GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder;

    beforeAll(() => {
      gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock = {
        build: jest.fn(),
      };

      gameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder =
        new GameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder(
          gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock,
        );
    });

    describe('.build', () => {
      let gameSpecCreateQueryFixture: GameSpecCreateQuery;

      beforeAll(() => {
        gameSpecCreateQueryFixture = GameSpecCreateQueryFixtures.any;
      });

      describe('when called', () => {
        let cardSpecsStringifiedFixture: string;

        let result: unknown;

        beforeAll(() => {
          cardSpecsStringifiedFixture = 'cards-fixture';

          gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build.mockReturnValueOnce(
            cardSpecsStringifiedFixture,
          );

          result =
            gameSpecCreateQueryTypeormFromGameGameSpecCreateQueryBuilder.build(
              gameSpecCreateQueryFixture,
            );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call gameCardSpecArrayToGameCardSpecArrayDbConverter.build()', () => {
          expect(
            gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameCardSpecArrayDbFromGameCardSpecArrayBuilderMock.build,
          ).toHaveBeenCalledWith(gameSpecCreateQueryFixture.cards);
        });

        it('should return DeepPartial<GameSpecDb>', () => {
          const expected: QueryDeepPartialEntity<GameSpecDb> = {
            cardsSpec: cardSpecsStringifiedFixture,
            chainDraw2Draw2Cards:
              gameSpecCreateQueryFixture.options.chainDraw2Draw2Cards,
            chainDraw2Draw4Cards:
              gameSpecCreateQueryFixture.options.chainDraw2Draw4Cards,
            chainDraw4Draw2Cards:
              gameSpecCreateQueryFixture.options.chainDraw4Draw2Cards,
            chainDraw4Draw4Cards:
              gameSpecCreateQueryFixture.options.chainDraw4Draw4Cards,
            game: { id: gameSpecCreateQueryFixture.options.gameId },
            gameSlotsAmount: gameSpecCreateQueryFixture.gameSlotsAmount,
            id: gameSpecCreateQueryFixture.id,
            playCardIsMandatory:
              gameSpecCreateQueryFixture.options.playCardIsMandatory,
            playMultipleSameCards:
              gameSpecCreateQueryFixture.options.playMultipleSameCards,
            playWildDraw4IfNoOtherAlternative:
              gameSpecCreateQueryFixture.options
                .playWildDraw4IfNoOtherAlternative,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  },
);
