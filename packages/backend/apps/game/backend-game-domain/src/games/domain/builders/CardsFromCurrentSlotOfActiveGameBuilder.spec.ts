import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';

import { CardFixtures } from '../../../cards/domain/fixtures';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { ActiveGameSlotFixtures } from '../fixtures/ActiveGameSlotFixtures';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { CardsFromCurrentSlotOfActiveGameBuilder } from './CardsFromCurrentSlotOfActiveGameBuilder';

describe(CardsFromCurrentSlotOfActiveGameBuilder.name, () => {
  let cardsFromActiveGameSlotBuilderMock: jest.Mocked<
    Builder<Card[], [ActiveGameSlot, number[]]>
  >;
  let gameServiceMock: jest.Mocked<GameService>;

  let cardsFromCurrentSlotOfActiveGameBuilder: CardsFromCurrentSlotOfActiveGameBuilder;

  beforeAll(() => {
    cardsFromActiveGameSlotBuilderMock = {
      build: jest.fn(),
    };
    gameServiceMock = {
      getGameSlotOrThrow: jest.fn() as unknown,
    } as Partial<jest.Mocked<GameService>> as jest.Mocked<GameService>;

    cardsFromCurrentSlotOfActiveGameBuilder =
      new CardsFromCurrentSlotOfActiveGameBuilder(
        cardsFromActiveGameSlotBuilderMock,
        gameServiceMock,
      );
  });

  describe('.build', () => {
    let activeGameFixture: ActiveGame;
    let cardIndexesFixture: number[];

    beforeAll(() => {
      activeGameFixture = ActiveGameFixtures.any;
      cardIndexesFixture = [0];
    });

    describe('when called', () => {
      let cardsFixture: Card[];
      let gameSlotFixture: ActiveGameSlot;

      let result: unknown;

      beforeAll(() => {
        cardsFixture = [CardFixtures.any];
        gameSlotFixture = ActiveGameSlotFixtures.any;

        gameServiceMock.getGameSlotOrThrow.mockReturnValueOnce(gameSlotFixture);

        cardsFromActiveGameSlotBuilderMock.build.mockReturnValueOnce(
          cardsFixture,
        );

        result = cardsFromCurrentSlotOfActiveGameBuilder.build(
          activeGameFixture,
          cardIndexesFixture,
        );
      });

      it('should call gameService.getGameSlotOrThrow()', () => {
        expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledTimes(1);
        expect(gameServiceMock.getGameSlotOrThrow).toHaveBeenCalledWith(
          activeGameFixture,
          activeGameFixture.state.currentPlayingSlotIndex,
        );
      });

      it('should call cardsFromActiveGameSlotBuilder.build()', () => {
        expect(cardsFromActiveGameSlotBuilderMock.build).toHaveBeenCalledTimes(
          1,
        );
        expect(cardsFromActiveGameSlotBuilderMock.build).toHaveBeenCalledWith(
          gameSlotFixture,
          cardIndexesFixture,
        );
      });

      it('should return Card[]', () => {
        expect(result).toStrictEqual(cardsFixture);
      });
    });
  });
});
