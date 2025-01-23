import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./BaseGameListItem');

import { models as apiModels } from '@cornie-js/api-models';
import { render } from '@testing-library/react';

import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
import { BaseGameListItem, BaseGameListItemOptions } from './BaseGameListItem';
import { FinishedGameListItem } from './FinishedGameListItem';

describe(FinishedGameListItem.name, () => {
  let gameV1Fixture: apiModels.GameV1;
  let finishedGameWinnerFixture: apiModels.UserV1;
  let gameWithWinnerUserPairFixture: GameWithWinnerUserPair;

  beforeAll(() => {
    gameV1Fixture = {
      id: 'id',
      isPublic: false,
      name: 'name-fixture',
      state: {
        slots: [
          {
            cardsAmount: 0,
            userId: 'userId-fixture-1',
          },
          {
            cardsAmount: 3,
            userId: 'userId-fixture-2',
          },
        ],
        status: 'finished',
      },
    };

    finishedGameWinnerFixture = {
      active: true,
      id: 'id-fixture-1',
      name: 'name-fixture-1',
    };

    gameWithWinnerUserPairFixture = {
      game: gameV1Fixture,
      winnerUser: finishedGameWinnerFixture,
    };
  });

  describe('when called', () => {
    let baseGameListItemContentFixture: string;

    let baseGameListItemContent: string | null | undefined;

    beforeAll(() => {
      baseGameListItemContentFixture = 'Expected content fixture';

      const baseGameListItemFixture = (
        <div className="base-game-list-item-fixture">
          {baseGameListItemContentFixture}
        </div>
      );

      (
        BaseGameListItem as jest.Mock<typeof BaseGameListItem>
      ).mockReturnValueOnce(baseGameListItemFixture);

      const renderResult = render(
        <FinishedGameListItem
          gameWithWinnerUser={gameWithWinnerUserPairFixture}
        />,
      );

      const baseGameListItem: ChildNode | undefined =
        renderResult.container.querySelector('.base-game-list-item-fixture')
          ?.childNodes[0];

      baseGameListItemContent = baseGameListItem?.nodeValue;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call BaseGameListItem()', () => {
      const expectedOptions: BaseGameListItemOptions = {
        button: expect.anything() as unknown as React.JSX.Element,
        gameText: gameV1Fixture.name,
      };

      expect(BaseGameListItem).toHaveBeenCalledTimes(1);
      expect(BaseGameListItem).toHaveBeenCalledWith(expectedOptions, undefined);
    });

    it('should return expected content', () => {
      expect(baseGameListItemContent).toBe(baseGameListItemContentFixture);
    });
  });
});
