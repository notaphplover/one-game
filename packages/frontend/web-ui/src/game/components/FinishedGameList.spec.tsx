import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./BaseGameList');

import { render, RenderResult } from '@testing-library/react';
import React from 'react';

import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
import { BaseGameList, BaseGameListOptions } from './BaseGameList';
import { FinishedGameList, FinishedGameListOptions } from './FinishedGameList';

describe(FinishedGameList.name, () => {
  let optionsFixture: FinishedGameListOptions;

  beforeAll(() => {
    optionsFixture = {
      gameResourcesListResult: null,
    };
  });

  describe('when called', () => {
    let baseGameListResultFixture: React.JSX.Element;
    let baseGameListContentFixture: string;

    let baseGameListContent: string | null | undefined;

    beforeAll(() => {
      baseGameListContentFixture = 'Expected content fixture';
      baseGameListResultFixture = (
        <div data-testid="base-game-list-fixture">
          {baseGameListContentFixture}
        </div>
      );

      (BaseGameList as jest.Mock<typeof BaseGameList>).mockReturnValueOnce(
        baseGameListResultFixture,
      );

      const renderResult: RenderResult = render(
        <FinishedGameList
          gameResourcesListResult={optionsFixture.gameResourcesListResult}
        />,
      );

      const baseGameList: ChildNode | undefined = renderResult.getByTestId(
        'base-game-list-fixture',
      ).childNodes[0];

      baseGameListContent = baseGameList?.nodeValue;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call BaseGameList()', () => {
      const expectedOptions: BaseGameListOptions<GameWithWinnerUserPair> = {
        buildGameItem: expect.any(Function) as unknown as (
          gameWithWinnerUser: GameWithWinnerUserPair,
          key: number,
        ) => React.JSX.Element,
        gameResourcesListResult: null,
      };

      expect(BaseGameList).toHaveBeenCalledTimes(1);
      expect(BaseGameList).toHaveBeenCalledWith(expectedOptions, undefined);
    });

    it('should return expected content', () => {
      expect(baseGameListContent).toBe(baseGameListContentFixture);
    });
  });
});
