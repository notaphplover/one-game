import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../app/store/hooks');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../../game/components/ActiveGameList');
jest.mock('../../game/components/NonStartedGameList');

import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useAppSelector } from '../../app/store/hooks';
import { cornieApi } from '../../common/http/services/cornieApi';
import { ActiveGameList } from '../../game/components/ActiveGameList';
import { NonStartedGameList } from '../../game/components/NonStartedGameList';
import { HomeWithAuth } from './HomeWithAuth';

describe(HomeWithAuth.name, () => {
  let accessTokenFixture: string;

  beforeAll(() => {
    accessTokenFixture = 'access-token-fixture';
  });

  describe('when called,', () => {
    let expectedActiveGameListFixture: ChildNode;
    let expectedNonStartedGameListFixture: ChildNode;
    let activeGameListFixture: React.JSX.Element;
    let nonStartedGameListFixture: React.JSX.Element;

    let activeGameListComponent: unknown;
    let nonStartedGameListComponent: unknown;

    beforeAll(() => {
      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(accessTokenFixture);

      (
        cornieApi.useGetGamesV1MineQuery as jest.Mock<
          typeof cornieApi.useGetGamesV1MineQuery
        >
      )
        .mockReturnValueOnce({
          data: undefined,
          error: undefined,
          isLoading: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          refetch: jest.fn<any>(),
        })
        .mockReturnValueOnce({
          data: undefined,
          error: undefined,
          isLoading: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          refetch: jest.fn<any>(),
        });

      activeGameListFixture = (
        <div className="active-game-list-fixture">Active game list mock</div>
      );

      nonStartedGameListFixture = (
        <div className="non-started-game-list-fixture">
          Non started game list mock
        </div>
      );

      (ActiveGameList as jest.Mock<typeof ActiveGameList>).mockReturnValueOnce(
        activeGameListFixture,
      );

      (
        NonStartedGameList as jest.Mock<typeof NonStartedGameList>
      ).mockReturnValueOnce(nonStartedGameListFixture);

      expectedActiveGameListFixture = render(activeGameListFixture).container
        .childNodes[0] as ChildNode;

      expectedNonStartedGameListFixture = render(nonStartedGameListFixture)
        .container.childNodes[0] as ChildNode;

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <HomeWithAuth />
        </MemoryRouter>,
      );

      activeGameListComponent = renderResult.container.querySelector(
        '.active-game-list-fixture',
      );

      nonStartedGameListComponent = renderResult.container.querySelector(
        '.non-started-game-list-fixture',
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call ActiveGameList()', () => {
      expect(ActiveGameList).toHaveBeenCalledTimes(1);
      expect(ActiveGameList).toHaveBeenCalledWith(
        {
          gamesResult: null,
        },
        {},
      );
    });

    it('should call NonStartedGameList()', () => {
      expect(NonStartedGameList).toHaveBeenCalledTimes(1);
      expect(NonStartedGameList).toHaveBeenCalledWith(
        {
          gamesResult: null,
        },
        {},
      );
    });

    it('should render an active game list', () => {
      expect(activeGameListComponent).toStrictEqual(
        expectedActiveGameListFixture,
      );
    });

    it('should render a non started game list', () => {
      expect(nonStartedGameListComponent).toStrictEqual(
        expectedNonStartedGameListFixture,
      );
    });
  });
});
