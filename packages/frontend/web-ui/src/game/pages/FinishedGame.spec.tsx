import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../app/store/hooks');
jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../components/FinishedGameList');

import { render, RenderResult } from '@testing-library/react';
import { MouseEventHandler } from 'react';
import { MemoryRouter } from 'react-router';

import { useAppSelector } from '../../app/store/hooks';
import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import {
  FinishedGameList,
  FinishedGameListOptions,
} from '../components/FinishedGameList';
import { FinishedGame } from './FinishedGame';

describe(FinishedGame.name, () => {
  let accessTokenFixture: string;

  beforeAll(() => {
    accessTokenFixture = 'access-token-fixture';
  });

  describe('when called,', () => {
    let expectedFinishedGameListFixture: ChildNode;
    let finishedGameListFixture: React.JSX.Element;

    let finishedGameListComponent: unknown;

    beforeAll(() => {
      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(accessTokenFixture);

      (
        cornieApi.useGetGamesV1MineQuery as jest.Mock<
          typeof cornieApi.useGetGamesV1MineQuery
        >
      ).mockReturnValueOnce({
        data: undefined,
        error: undefined,
        isLoading: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: jest.fn<any>(),
      });

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValueOnce(null);

      finishedGameListFixture = (
        <div className="finished-game-list-fixture">
          Finished game list mock
        </div>
      );

      (
        FinishedGameList as jest.Mock<typeof FinishedGameList>
      ).mockReturnValueOnce(finishedGameListFixture);

      expectedFinishedGameListFixture = render(finishedGameListFixture)
        .container.childNodes[0] as ChildNode;

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <FinishedGame />
        </MemoryRouter>,
      );

      finishedGameListComponent = renderResult.container.querySelector(
        '.finished-game-list-fixture',
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call FinishedGameList()', () => {
      const expectedOptions: FinishedGameListOptions = {
        gameResourcesListResult: null,
        pagination: {
          onNextPageButtonClick: expect.any(
            Function,
          ) as unknown as MouseEventHandler<HTMLButtonElement>,
          onPreviousPageButtonClick: expect.any(
            Function,
          ) as unknown as MouseEventHandler<HTMLButtonElement>,
        },
        title: 'Finished Games',
      };

      expect(FinishedGameList).toHaveBeenCalledTimes(1);
      expect(FinishedGameList).toHaveBeenCalledWith(expectedOptions, undefined);
    });

    it('should render an active game list', () => {
      expect(finishedGameListComponent).toStrictEqual(
        expectedFinishedGameListFixture,
      );
    });
  });
});
