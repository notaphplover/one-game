import { beforeAll, afterAll, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  STATUS_GAME_FULFILLED,
  STATUS_GAME_REJECTED,
  useGetGames,
} from '../hooks/useGetGames';
import { HomeWithAuth } from './HomeWithAuth';

jest.mock('../hooks/useGetGames');

const NOT_EXISTS_PENDING_GAMES = 'No pending games found.';

describe(HomeWithAuth.name, () => {
  let statusFixture;
  let gameListFixture;

  beforeAll(() => {
    statusFixture = 'idle';

    gameListFixture = [];
  });

  describe('when called, on an initial state', () => {
    let result;
    let pendingGameTextWhite;

    beforeAll(() => {
      useGetGames.mockReturnValue({
        errorMessage: null,
        status: statusFixture,
        gameList: gameListFixture,
      });

      result = render(
        <MemoryRouter>
          <HomeWithAuth />
        </MemoryRouter>,
      );

      const pendingGameText = result.container.querySelector(
        '.home-auth-text-white',
      );

      pendingGameTextWhite = pendingGameText.childNodes[0].nodeValue;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should show a sentence with not exists pending games', () => {
      expect(pendingGameTextWhite).toEqual(NOT_EXISTS_PENDING_GAMES);
    });
  });

  describe('when called, and only exists one game pending', () => {
    let result;
    let pendingGameName;

    beforeAll(() => {
      useGetGames.mockReturnValue({
        errorMessage: null,
        status: STATUS_GAME_FULFILLED,
        gameList: [
          {
            id: 'id',
            name: 'name',
            spec: {},
            state: {
              status: 'nonStarted',
            },
          },
        ],
      });

      result = render(
        <MemoryRouter>
          <HomeWithAuth />
        </MemoryRouter>,
      );

      const pendingGameText = result.container.querySelector('.game-list-text');

      pendingGameName = pendingGameText.childNodes[0].nodeValue;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should show a list of pending games', () => {
      expect(pendingGameName).toEqual('name');
    });
  });

  describe('when called, and only exists one game active', () => {
    let result;
    let activeGameName;

    beforeAll(() => {
      useGetGames.mockReturnValue({
        errorMessage: null,
        status: STATUS_GAME_FULFILLED,
        gameList: [
          {
            id: 'id',
            name: 'name',
            spec: {},
            state: {
              status: 'active',
            },
          },
        ],
      });

      result = render(
        <MemoryRouter>
          <HomeWithAuth />
        </MemoryRouter>,
      );

      const activeGameText = result.container.querySelector('.game-list-text');

      activeGameName = activeGameText.childNodes[0].nodeValue;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should show a list of active games', () => {
      expect(activeGameName).toEqual('name');
    });
  });

  describe('when called, and exists one pending game and one game active', () => {
    let result;
    let activeGameName;
    let pendingGameName;

    beforeAll(() => {
      useGetGames.mockReturnValue({
        errorMessage: null,
        status: STATUS_GAME_FULFILLED,
        gameList: [
          {
            id: 'id-game-pending',
            name: 'name-pending',
            spec: {},
            state: {
              status: 'nonStarted',
            },
          },
          {
            id: 'id-game-active',
            name: 'name-active',
            spec: {},
            state: {
              status: 'active',
            },
          },
        ],
      });

      result = render(
        <MemoryRouter>
          <HomeWithAuth />
        </MemoryRouter>,
      );

      const pendingGameText = result.container.querySelector('.game-list-text');

      pendingGameName = pendingGameText.childNodes[0].nodeValue;

      const activeGameText = result.container.querySelector('.game-list-text');

      activeGameName = activeGameText.childNodes[0].nodeValue;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should show a list of active games', () => {
      expect(activeGameName).toEqual('name-pending');
    });

    it('should show a list of pending games', () => {
      expect(pendingGameName).toEqual('name-pending');
    });
  });

  describe('when called, and status is rejected', () => {
    let result;
    let pendingGameTextWhite;

    beforeAll(() => {
      useGetGames.mockReturnValue({
        errorMessage: 'error fixture',
        status: STATUS_GAME_REJECTED,
        gameList: [],
      });

      result = render(
        <MemoryRouter>
          <HomeWithAuth />
        </MemoryRouter>,
      );

      const pendingGameText = result.container.querySelector(
        '.home-auth-text-white',
      );

      pendingGameTextWhite = pendingGameText.childNodes[0].nodeValue;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should show a sentence with not exists pending games', () => {
      expect(pendingGameTextWhite).toEqual(NOT_EXISTS_PENDING_GAMES);
    });
  });
});
