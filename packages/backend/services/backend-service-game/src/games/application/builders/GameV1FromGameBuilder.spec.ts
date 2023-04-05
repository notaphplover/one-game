import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { CardV1Fixtures } from '../../../cards/application/fixtures/CardV1Fixtures';
import { GameSpecV1Fixtures } from '../../../cards/application/fixtures/GameSpecV1Fixtures';
import { Card } from '../../../cards/domain/models/Card';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { ActiveGameFixtures } from '../../domain/fixtures/ActiveGameFixtures';
import { ActiveGame } from '../../domain/models/ActiveGame';
import { GameCardSpec } from '../../domain/models/GameCardSpec';
import { GameDirection } from '../../domain/models/GameDirection';
import { GameV1FromGameBuilder } from './GameV1FromGameBuilder';

describe(GameV1FromGameBuilder.name, () => {
  let cardColorV1FromCardColorBuilderMock: jest.Mocked<
    Builder<apiModels.CardColorV1, [CardColor]>
  >;
  let cardV1FromCardBuilderMock: jest.Mocked<Builder<apiModels.CardV1, [Card]>>;
  let gameDirectionV1FromGameDirectionBuilderMock: jest.Mocked<
    Builder<apiModels.GameDirectionV1, [GameDirection]>
  >;
  let gameSpecV1FromGameCardSpecsBuilderMock: jest.Mocked<
    Builder<apiModels.GameSpecV1, [GameCardSpec[]]>
  >;

  let gameV1FromGameBuilder: GameV1FromGameBuilder;

  beforeAll(() => {
    cardColorV1FromCardColorBuilderMock = {
      build: jest.fn(),
    };
    cardV1FromCardBuilderMock = {
      build: jest.fn(),
    };
    gameDirectionV1FromGameDirectionBuilderMock = {
      build: jest.fn(),
    };
    gameSpecV1FromGameCardSpecsBuilderMock = {
      build: jest.fn(),
    };

    gameV1FromGameBuilder = new GameV1FromGameBuilder(
      cardColorV1FromCardColorBuilderMock,
      cardV1FromCardBuilderMock,
      gameDirectionV1FromGameDirectionBuilderMock,
      gameSpecV1FromGameCardSpecsBuilderMock,
    );
  });

  describe('.build', () => {
    describe('having an ActiveGame', () => {
      let gameFixture: ActiveGame;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.any;
      });

      describe('when called', () => {
        let cardV1Fixture: apiModels.CardV1;
        let cardColorV1Fixture: apiModels.CardColorV1;
        let gameDirectionV1Fixture: apiModels.GameDirectionV1;
        let gameSpecV1Fixture: apiModels.GameSpecV1;

        let result: unknown;

        beforeAll(() => {
          cardV1Fixture = CardV1Fixtures.any;
          cardColorV1Fixture = 'blue';
          gameDirectionV1Fixture = 'antiClockwise';
          gameSpecV1Fixture = GameSpecV1Fixtures.any;

          cardColorV1FromCardColorBuilderMock.build.mockReturnValueOnce(
            cardColorV1Fixture,
          );
          cardV1FromCardBuilderMock.build.mockReturnValueOnce(cardV1Fixture);
          gameDirectionV1FromGameDirectionBuilderMock.build.mockReturnValueOnce(
            gameDirectionV1Fixture,
          );
          gameSpecV1FromGameCardSpecsBuilderMock.build.mockReturnValueOnce(
            gameSpecV1Fixture,
          );

          result = gameV1FromGameBuilder.build(gameFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call cardColorV1FromCardColorBuilder.build()', () => {
          expect(
            cardColorV1FromCardColorBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            cardColorV1FromCardColorBuilderMock.build,
          ).toHaveBeenCalledWith(gameFixture.currentColor);
        });

        it('should call cardV1FromCardBuilder.build()', () => {
          expect(cardV1FromCardBuilderMock.build).toHaveBeenCalledTimes(1);
          expect(cardV1FromCardBuilderMock.build).toHaveBeenCalledWith(
            gameFixture.currentCard,
          );
        });

        it('should call gameDirectionV1FromGameDirectionBuilder.build()', () => {
          expect(
            gameDirectionV1FromGameDirectionBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameDirectionV1FromGameDirectionBuilderMock.build,
          ).toHaveBeenCalledWith(gameFixture.currentDirection);
        });

        it('should call gameSpecV1FromGameCardSpecsBuilder.build()', () => {
          expect(
            gameSpecV1FromGameCardSpecsBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            gameSpecV1FromGameCardSpecsBuilderMock.build,
          ).toHaveBeenCalledWith(gameFixture.spec);
        });

        it('should return a GameV1', () => {
          const expected: apiModels.GameV1 = {
            currentCard: cardV1Fixture,
            currentColor: cardColorV1Fixture,
            currentDirection: gameDirectionV1Fixture,
            currentPlayingSlotIndex: gameFixture.currentPlayingSlotIndex,
            gameSlotsAmount: gameFixture.slots.length,
            gameSpec: gameSpecV1Fixture,
            id: gameFixture.id,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
