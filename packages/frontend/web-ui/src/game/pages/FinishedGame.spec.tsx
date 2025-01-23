import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../app/store/hooks');
jest.mock('../components/FinishedGameList');
jest.mock('../hooks/useGetGamesWithWinnerPairV1');

import { GetGamesV1MineArgs } from '@cornie-js/frontend-api-rtk-query';
import { SubscriptionOptions } from '@reduxjs/toolkit/query';
import { render, RenderResult } from '@testing-library/react';
import { MouseEventHandler } from 'react';
import { MemoryRouter } from 'react-router';

import { useAppSelector } from '../../app/store/hooks';
import { Right } from '../../common/models/Either';
import {
  FinishedGameList,
  FinishedGameListOptions,
} from '../components/FinishedGameList';
import { useGetGamesWithWinnerPairV1 } from '../hooks/useGetGamesWithWinnerPairV1';
import { GameWithWinnerUserPair } from '../models/GameWithWinnerUserPair';
import { FinishedGame } from './FinishedGame';

type UseQuerySubscriptionOptions = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
};

describe(FinishedGame.name, () => {
  let accessTokenFixture: string;

  beforeAll(() => {
    accessTokenFixture = 'access-token-fixture';
  });

  describe('when called,', () => {
    let gameFinishedGamesResultFixture: Right<GameWithWinnerUserPair[]>;
    let expectedFinishedGameListFixture: ChildNode;
    let finishedGameListFixture: React.JSX.Element;
    let getGamesV1MineArgsFixture: GetGamesV1MineArgs;
    let subscriptionOptionsFixture: UseQuerySubscriptionOptions;

    let finishedGameListComponent: unknown;

    beforeAll(() => {
      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(accessTokenFixture);

      finishedGameListFixture = (
        <div className="finished-game-list-fixture">
          Finished game list mock
        </div>
      );

      gameFinishedGamesResultFixture = {
        isRight: true,
        value: [
          {
            game: {
              id: 'game-id',
              isPublic: true,
              state: {
                slots: [
                  { cardsAmount: 0, userId: 'user-id-1-fixture' },
                  { cardsAmount: 34, userId: 'user-id-2-fixture' },
                ],
                status: 'finished',
              },
            },
            winnerUser: {
              active: true,
              id: 'user-id-1-fixture',
              name: 'user-name-fixture',
            },
          },
        ],
      };

      getGamesV1MineArgsFixture = {
        params: [
          {
            page: '1',
            pageSize: '10',
            status: 'finished',
          },
        ],
      };

      subscriptionOptionsFixture = {
        pollingInterval: 10000,
      };

      (
        useGetGamesWithWinnerPairV1 as jest.Mock<
          typeof useGetGamesWithWinnerPairV1
        >
      ).mockReturnValue({ result: gameFinishedGamesResultFixture });

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

    it('should call useGetGamesWithWinnerPairV1()', () => {
      expect(useGetGamesWithWinnerPairV1).toHaveBeenCalledTimes(1);
      expect(useGetGamesWithWinnerPairV1).toHaveBeenCalledWith(
        getGamesV1MineArgsFixture,
        subscriptionOptionsFixture,
      );
    });

    it('should call FinishedGameList()', () => {
      const expectedOptions: FinishedGameListOptions = {
        gameResourcesListResult: gameFinishedGamesResultFixture,
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
