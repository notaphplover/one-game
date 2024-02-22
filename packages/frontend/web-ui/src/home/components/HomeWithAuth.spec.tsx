import { beforeAll, afterAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../hooks/useGetGames');
jest.mock('../../game/components/GameList');

import { RenderResult, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { models as apiModels } from '@cornie-js/api-models';
import { useGetGames } from '../hooks/useGetGames';
import { GameList } from '../../game/components/GameList';
import { HomeWithAuth } from './HomeWithAuth';
import { Either } from '../../common/models/Either';
import { UseGetGamesParams } from '../models/UseGetGamesResult';

describe(HomeWithAuth.name, () => {
  describe('useGetGames', () => {
    describe('when called,', () => {
      let expectedGameListFixture: ChildNode;
      let gameListFixture: React.JSX.Element;

      let gameListComponent: unknown;

      beforeAll(() => {
        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: jest.fn(),
          result: null,
        });

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: jest.fn(),
          result: null,
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

      it('should call GameList() twice times', () => {
        expect(GameList).toHaveBeenCalledTimes(2);
        expect(GameList).toHaveBeenNthCalledWith(
          1,
          {
            gamesResult: null,
          },
          {},
        );
        expect(GameList).toHaveBeenNthCalledWith(
          2,
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

    describe('when called, and the button ArrowForward in Pending games section is pressed', () => {
      let gameListFixture: React.JSX.Element;
      let renderResult: RenderResult;
      let resultGameNonStarted: null | Either<string, apiModels.GameArrayV1>;
      let callNonStartedMock: jest.Mock<(params: UseGetGamesParams) => void>;
      let callActiveMock: jest.Mock<(params: UseGetGamesParams) => void>;

      let buttonArrowForwardNonStarted: Element;

      beforeAll(() => {
        callNonStartedMock = jest.fn();
        callActiveMock = jest.fn();

        resultGameNonStarted = {
          isRight: true,
          value: [
            {
              id: 'id-fixture',
              name: 'name-fixture',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
            {
              id: 'id-fixture2',
              name: 'name-fixture2',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
            {
              id: 'id-fixture3',
              name: 'name-fixture3',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
          ],
        };

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callNonStartedMock,
          result: resultGameNonStarted,
        });

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callActiveMock,
          result: null,
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

        buttonArrowForwardNonStarted = renderResult.container.querySelector(
          '.arrowforward-nonstarted',
        ) as Element;

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callNonStartedMock,
          result: resultGameNonStarted,
        });

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callActiveMock,
          result: null,
        });

        fireEvent.click(buttonArrowForwardNonStarted);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call callNonStarted() twice times', () => {
        expect(callNonStartedMock).toHaveBeenCalledTimes(2);
        expect(callNonStartedMock).toHaveBeenNthCalledWith(1, {
          pageNumber: 1,
          status: 'nonStarted',
        });
        expect(callNonStartedMock).toHaveBeenNthCalledWith(2, {
          pageNumber: 2,
          status: 'nonStarted',
        });
      });

      it('should call callActive() once time', () => {
        expect(callActiveMock).toHaveBeenCalledTimes(1);
        expect(callActiveMock).toHaveBeenCalledWith({
          pageNumber: 1,
          status: 'active',
        });
      });
    });

    describe('when called, and the button ArrowBack in Pending games section is pressed', () => {
      let gameListFixture: React.JSX.Element;
      let renderResult: RenderResult;
      let resultGameNonStarted: null | Either<string, apiModels.GameArrayV1>;
      let callNonStartedMock: jest.Mock<(params: UseGetGamesParams) => void>;
      let callActiveMock: jest.Mock<(params: UseGetGamesParams) => void>;

      let buttonArrowBackNonStarted: Element;

      beforeAll(() => {
        callNonStartedMock = jest.fn();
        callActiveMock = jest.fn();

        resultGameNonStarted = {
          isRight: true,
          value: [
            {
              id: 'id-fixture',
              name: 'name-fixture',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
            {
              id: 'id-fixture2',
              name: 'name-fixture2',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
            {
              id: 'id-fixture3',
              name: 'name-fixture3',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
          ],
        };

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callNonStartedMock,
          result: resultGameNonStarted,
        });

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callActiveMock,
          result: null,
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

        buttonArrowBackNonStarted = renderResult.container.querySelector(
          '.arrowback-nonstarted',
        ) as Element;

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callNonStartedMock,
          result: resultGameNonStarted,
        });

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callActiveMock,
          result: null,
        });

        fireEvent.click(buttonArrowBackNonStarted);
      });

      afterAll(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it('should call callNonStarted() once time', () => {
        expect(callNonStartedMock).toHaveBeenCalledTimes(1);
        expect(callNonStartedMock).toHaveBeenCalledWith({
          pageNumber: 1,
          status: 'nonStarted',
        });
      });

      it('should call callActive() once time', () => {
        expect(callActiveMock).toHaveBeenCalledTimes(1);
        expect(callActiveMock).toHaveBeenCalledWith({
          pageNumber: 1,
          status: 'active',
        });
      });
    });

    describe('when called, and the button ArrowForward in Active games section is pressed', () => {
      let gameListFixture: React.JSX.Element;
      let renderResult: RenderResult;
      let resultGameActive: null | Either<string, apiModels.GameArrayV1>;
      let callNonStartedMock: jest.Mock<(params: UseGetGamesParams) => void>;
      let callActiveMock: jest.Mock<(params: UseGetGamesParams) => void>;

      let buttonArrowForwardActive: Element;

      beforeAll(() => {
        callNonStartedMock = jest.fn();
        callActiveMock = jest.fn();

        resultGameActive = {
          isRight: true,
          value: [
            {
              id: 'id-fixture',
              name: 'name-fixture',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
            {
              id: 'id-fixture2',
              name: 'name-fixture2',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
            {
              id: 'id-fixture3',
              name: 'name-fixture3',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
          ],
        };

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callNonStartedMock,
          result: null,
        });

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callActiveMock,
          result: resultGameActive,
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

        buttonArrowForwardActive = renderResult.container.querySelector(
          '.arrowforward-active',
        ) as Element;

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callNonStartedMock,
          result: null,
        });

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callActiveMock,
          result: resultGameActive,
        });

        fireEvent.click(buttonArrowForwardActive);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call callNonStarted() once time', () => {
        expect(callNonStartedMock).toHaveBeenCalledTimes(1);
        expect(callNonStartedMock).toHaveBeenCalledWith({
          pageNumber: 1,
          status: 'nonStarted',
        });
      });

      it('should call callActive() twice times', () => {
        expect(callActiveMock).toHaveBeenCalledTimes(2);
        expect(callActiveMock).toHaveBeenNthCalledWith(1, {
          pageNumber: 1,
          status: 'active',
        });
        expect(callActiveMock).toHaveBeenNthCalledWith(2, {
          pageNumber: 2,
          status: 'active',
        });
      });
    });

    describe('when called, and the button ArrowBack in Active games section is pressed', () => {
      let gameListFixture: React.JSX.Element;
      let renderResult: RenderResult;
      let resultGameActive: null | Either<string, apiModels.GameArrayV1>;
      let callNonStartedMock: jest.Mock<(params: UseGetGamesParams) => void>;
      let callActiveMock: jest.Mock<(params: UseGetGamesParams) => void>;

      let buttonArrowBackActive: Element;

      beforeAll(() => {
        callNonStartedMock = jest.fn();
        callActiveMock = jest.fn();

        resultGameActive = {
          isRight: true,
          value: [
            {
              id: 'id-fixture',
              name: 'name-fixture',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
            {
              id: 'id-fixture2',
              name: 'name-fixture2',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
            {
              id: 'id-fixture3',
              name: 'name-fixture3',
              state: {
                slots: [],
                status: 'nonStarted',
              },
            },
          ],
        };

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callNonStartedMock,
          result: null,
        });

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callActiveMock,
          result: resultGameActive,
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

        buttonArrowBackActive = renderResult.container.querySelector(
          '.arrowback-active',
        ) as Element;

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callNonStartedMock,
          result: null,
        });

        (useGetGames as jest.Mock<typeof useGetGames>).mockReturnValueOnce({
          call: callActiveMock,
          result: resultGameActive,
        });

        fireEvent.click(buttonArrowBackActive);
      });

      afterAll(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
      });

      it('should call callNonStarted() once time', () => {
        expect(callNonStartedMock).toHaveBeenCalledTimes(1);
        expect(callNonStartedMock).toHaveBeenCalledWith({
          pageNumber: 1,
          status: 'nonStarted',
        });
      });

      it('should call callActive() once time', () => {
        expect(callActiveMock).toHaveBeenCalledTimes(1);
        expect(callActiveMock).toHaveBeenCalledWith({
          pageNumber: 1,
          status: 'active',
        });
      });
    });
  });
});
