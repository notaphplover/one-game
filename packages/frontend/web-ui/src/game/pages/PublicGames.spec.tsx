import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/hooks/useRedirectUnauthorized');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../../common/layout/CornieLayout');
jest.mock('../components/NonStartedGameList');

import { render, RenderResult } from '@testing-library/react';
import { MouseEventHandler } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import {
  NonStartedGameList,
  NonStartedGameListOptions,
} from '../components/NonStartedGameList';
import { PublicGames } from './PublicGames';

describe(PublicGames.name, () => {
  describe('when called', () => {
    let nonStartedGameListFixture: React.JSX.Element;

    let expectedNonStartedGameListFixture: ChildNode;

    let nonStartedGameListComponent: unknown;

    beforeAll(() => {
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
        cornieApi.useGetUsersV1MeQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeQuery
        >
      ).mockReturnValueOnce({
        data: undefined,
        error: undefined,
        isLoading: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: jest.fn<any>(),
      });

      (mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>)
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(null);

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

    it('should call NonStartedGameList()', () => {
      const expectedOptions: NonStartedGameListOptions = {
        buttons: {
          join: true,
        },
        gamesResult: null,
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
      expect(NonStartedGameList).toHaveBeenCalledWith(expectedOptions, {});
    });

    it('should render a non started game list', () => {
      expect(nonStartedGameListComponent).toStrictEqual(
        expectedNonStartedGameListFixture,
      );
    });
  });
});
