import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@one-game-js/backend-common';
import { DeepPartial } from 'typeorm';

import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { Card } from '../../../../cards/domain/models/Card';
import { GameCreateQueryFixtures } from '../../../domain/fixtures/GameCreateQueryFixtures';
import { GameCardSpec } from '../../../domain/models/GameCardSpec';
import { GameCreateQuery } from '../../../domain/query/GameCreateQuery';
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameDb } from '../models/GameDb';
import { GameCreateQueryToGameCreateQueryTypeOrmConverter } from './GameCreateQueryToGameCreateQueryTypeOrmConverter';

describe(GameCreateQueryToGameCreateQueryTypeOrmConverter.name, () => {
  let cardDbBuilderMock: jest.Mocked<Builder<CardDb, [Card]>>;

  let gameCreateQueryToGameCreateQueryTypeOrmConverter: GameCreateQueryToGameCreateQueryTypeOrmConverter;

  beforeAll(() => {
    cardDbBuilderMock = {
      build: jest.fn(),
    };

    gameCreateQueryToGameCreateQueryTypeOrmConverter =
      new GameCreateQueryToGameCreateQueryTypeOrmConverter(cardDbBuilderMock);
  });

  describe('.convert', () => {
    let gameCardSpecFixture: GameCardSpec;
    let gameCreateQueryFixture: GameCreateQuery;

    beforeAll(() => {
      gameCreateQueryFixture = GameCreateQueryFixtures.withSpecOne;

      [gameCardSpecFixture] = gameCreateQueryFixture.spec as [GameCardSpec];
    });

    describe('when called', () => {
      let cardDbFixture: CardDb;
      let result: unknown;

      beforeAll(() => {
        cardDbFixture = 39;

        cardDbBuilderMock.build.mockReturnValueOnce(cardDbFixture);

        result = gameCreateQueryToGameCreateQueryTypeOrmConverter.convert(
          gameCreateQueryFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call cardDbBuilder.build()', () => {
        expect(cardDbBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(cardDbBuilderMock.build).toHaveBeenCalledWith(
          gameCardSpecFixture.card,
        );
      });

      it('should return a DeepPartial<GameDb>', () => {
        const expectedGameCardSpecsDb: GameCardSpecDb[] = [
          {
            amount: gameCardSpecFixture.amount,
            card: cardDbFixture,
          },
        ];

        const expected: DeepPartial<GameDb> = {
          active: false,
          currentCard: null,
          currentColor: null,
          currentDirection: null,
          currentPlayingSlotIndex: null,
          gameSlotsAmount: gameCreateQueryFixture.gameSlotsAmount,
          id: gameCreateQueryFixture.id,
          specs: JSON.stringify(expectedGameCardSpecsDb),
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
