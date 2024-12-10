import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/hooks/useRedirectUnauthorized');
jest.mock('../../common/layout/CornieLayout');
jest.mock('../../user/hooks/useGetUserMe');
jest.mock('../components/NonStartedGameList');
jest.mock('../hooks/useGetGamesWithSpecsV1');

import { GetGamesV1Args } from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';
import { render, RenderResult } from '@testing-library/react';
import { MouseEventHandler } from 'react';
import { MemoryRouter } from 'react-router';

import { useGetUserMe } from '../../user/hooks/useGetUserMe';
import {
  NonStartedGameList,
  NonStartedGameListOptions,
} from '../components/NonStartedGameList';
import { useGetGamesWithSpecsV1 } from '../hooks/useGetGamesWithSpecsV1';
import { PublicGames } from './PublicGames';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(PublicGames.name, () => {
  describe('when called', () => {
    let nonStartedGameListFixture: React.JSX.Element;

    let expectedNonStartedGameListFixture: ChildNode;

    let nonStartedGameListComponent: unknown;

    beforeAll(() => {
      (
        useGetGamesWithSpecsV1 as jest.Mock<typeof useGetGamesWithSpecsV1>
      ).mockReturnValueOnce({ result: null });

      (useGetUserMe as jest.Mock<typeof useGetUserMe>).mockReturnValueOnce({
        queryResult: Symbol(),
        result: null,
      });

      nonStartedGameListFixture = (
        <div data-testid="non-started-game-list-fixture">
          Non started game list mock
        </div>
      );

      (
        NonStartedGameList as jest.Mock<typeof NonStartedGameList>
      ).mockReturnValueOnce(nonStartedGameListFixture);

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <PublicGames />
        </MemoryRouter>,
      );

      nonStartedGameListComponent = renderResult.getByTestId(
        'non-started-game-list-fixture',
      );

      expectedNonStartedGameListFixture = render(nonStartedGameListFixture)
        .container.childNodes[0] as ChildNode;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useGetUserMe()', () => {
      expect(useGetUserMe).toHaveBeenCalledTimes(1);
      expect(useGetUserMe).toHaveBeenCalledWith();
    });

    it('should call useGetGamesWithSpecsV1()', () => {
      const expectedGetGamesV1Args: GetGamesV1Args = {
        params: [
          {
            isPublic: 'true',
            page: '1',
            pageSize: '10',
            status: 'nonStarted',
          },
        ],
      };

      const expectedUseQuerySubscriptionOptions: UseQuerySubscriptionOptions = {
        pollingInterval: 10000,
      };

      expect(useGetGamesWithSpecsV1).toHaveBeenCalledTimes(1);
      expect(useGetGamesWithSpecsV1).toHaveBeenCalledWith(
        expectedGetGamesV1Args,
        expectedUseQuerySubscriptionOptions,
      );
    });

    it('should call NonStartedGameList()', () => {
      const expectedOptions: NonStartedGameListOptions = {
        buttons: {
          join: true,
        },
        gameResourcesListResult: null,
        pagination: {
          onNextPageButtonClick: expect.any(
            Function,
          ) as unknown as MouseEventHandler<HTMLButtonElement>,
          onPreviousPageButtonClick: expect.any(
            Function,
          ) as unknown as MouseEventHandler<HTMLButtonElement>,
        },
        title: 'Public Games',
        usersMeResult: null,
      };

      expect(NonStartedGameList).toHaveBeenCalledTimes(1);
      expect(NonStartedGameList).toHaveBeenCalledWith(
        expectedOptions,
        undefined,
      );
    });

    it('should render a non started game list', () => {
      expect(nonStartedGameListComponent).toStrictEqual(
        expectedNonStartedGameListFixture,
      );
    });
  });
});
