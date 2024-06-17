import { beforeAll, afterAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../app/store/hooks');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../../game/components/GameList');

import {
  RenderResult,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useAppSelector } from '../../app/store/hooks';
import { cornieApi } from '../../common/http/services/cornieApi';
import { GameList } from '../../game/components/GameList';
import { HomeWithAuth } from './HomeWithAuth';

const NUMBER_TIMES_EXECUTION: number = 2;

describe(HomeWithAuth.name, () => {
  let accessTokenFixture: string;

  beforeAll(() => {
    accessTokenFixture = 'access-token-fixture';
  });

  describe('useGetGames', () => {
    describe('when called,', () => {
      let expectedGameListFixture: ChildNode;
      let gameListFixture: React.JSX.Element;

      let gameListComponent: unknown;

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

        gameListFixture = <div className="game-list-mock">Game list mock</div>;

        (GameList as jest.Mock<typeof GameList>).mockReturnValueOnce(
          gameListFixture,
        );

        expectedGameListFixture = render(gameListFixture).container
          .childNodes[0] as ChildNode;

        const renderResult: RenderResult = render(
          <MemoryRouter>
            <HomeWithAuth />
          </MemoryRouter>,
        );

        gameListComponent =
          renderResult.container.querySelector('.game-list-mock');
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call GameList() twice', () => {
        expect(GameList).toHaveBeenCalledTimes(NUMBER_TIMES_EXECUTION);
        expect(GameList).toHaveBeenNthCalledWith(
          1,
          {
            gamesResult: null,
          },
          {},
        );
        expect(GameList).toHaveBeenNthCalledWith(
          NUMBER_TIMES_EXECUTION,
          {
            gamesResult: null,
          },
          {},
        );
      });

      it('should render a game list', () => {
        expect(gameListComponent).toStrictEqual(expectedGameListFixture);
      });
    });

    describe('when called, and the button New Game is pressed', () => {
      let renderResult: RenderResult;
      let gameListFixture: React.JSX.Element;
      let buttonNewGame: Element;

      beforeAll(async () => {
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

        gameListFixture = <div className="game-list-mock">Game list mock</div>;

        (GameList as jest.Mock<typeof GameList>).mockReturnValueOnce(
          gameListFixture,
        );

        renderResult = render(
          <MemoryRouter>
            <HomeWithAuth />
          </MemoryRouter>,
        );

        buttonNewGame = renderResult.container.querySelector(
          '.home-auth-button-new-game',
        ) as Element;

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

        fireEvent.click(buttonNewGame);

        await waitFor(() => {
          // eslint-disable-next-line jest/no-standalone-expect
          expect(screen.getByRole('button', { pressed: true })).toBeDefined();
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should press the new game button', () => {
        expect(screen.getByRole('button', { pressed: true })).toBeTruthy();
      });
    });
  });
});
