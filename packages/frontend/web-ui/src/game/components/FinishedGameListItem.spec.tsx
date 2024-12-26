import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./BaseGameListItem');
jest.mock('../hooks/useGetFinishedGameWinner');

import { models as apiModels } from '@cornie-js/api-models';
import { render } from '@testing-library/react';

import {
  useGetFinishedGameWinner,
  UseGetFinishedGameWinnerResult,
} from '../hooks/useGetFinishedGameWinner';
import { BaseGameListItem, BaseGameListItemOptions } from './BaseGameListItem';
import { FinishedGameListItem } from './FinishedGameListItem';

describe(FinishedGameListItem.name, () => {
  let gameV1Fixture: apiModels.GameV1;
  let finishedGameWinnerFixture: UseGetFinishedGameWinnerResult;

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
      finishedGameWinner: {
        active: true,
        id: 'id-fixture-1',
        name: 'name-fixture-1',
      },
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
        useGetFinishedGameWinner as jest.Mock<typeof useGetFinishedGameWinner>
      ).mockReturnValueOnce(finishedGameWinnerFixture);

      (
        BaseGameListItem as jest.Mock<typeof BaseGameListItem>
      ).mockReturnValueOnce(baseGameListItemFixture);

      const renderResult = render(
        <FinishedGameListItem game={gameV1Fixture} />,
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

    it('should call useGetFinishedGameWinner()', () => {
      expect(useGetFinishedGameWinner).toHaveBeenCalledTimes(1);
      expect(useGetFinishedGameWinner).toHaveBeenCalledWith(gameV1Fixture);
    });

    it('should return expected content', () => {
      expect(baseGameListItemContent).toBe(baseGameListItemContentFixture);
    });
  });
});
