import { beforeAll, describe, it, expect } from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { STATUS_GAME_FULFILLED } from '../../home/hooks/useGetGames';
import { GameList } from './GameList';

describe(GameList.name, () => {
  let statusFixture;
  let gameListFixture;

  beforeAll(() => {
    statusFixture = STATUS_GAME_FULFILLED;
    gameListFixture = [
      {
        id: 'id fixture',
        name: 'name fixture',
        state: {
          status: 'nonStarted',
        },
      },
    ];
  });

  describe('when called, and exist a game nonStarted and show this game and Share button', () => {
    let result;
    let nameGame;
    let nameButton;

    beforeAll(() => {
      result = render(
        <MemoryRouter>
          <GameList status={statusFixture} gameList={gameListFixture} />
        </MemoryRouter>,
      );

      const gameListItemText = result.container.querySelector(
        '.game-list-item-text',
      );
      nameGame = gameListItemText.childNodes[0].nodeValue;

      const gameListItemButton = result.container.querySelector(
        '.game-list-item-button',
      );
      nameButton = gameListItemButton.childNodes[1].data;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a name of the game', () => {
      expect(nameGame).toBe('name fixture');
    });
    it('should return a Share button', () => {
      expect(nameButton).toContain('Share');
    });
  });

  describe('when called, and exist a game active and show this game and Join button', () => {
    let result;
    let nameGame;
    let nameButton;

    beforeAll(() => {
      gameListFixture = [
        {
          id: 'id fixture',
          name: 'name fixture',
          state: {
            status: 'active',
          },
        },
      ];

      result = render(
        <MemoryRouter>
          <GameList status={statusFixture} gameList={gameListFixture} />
        </MemoryRouter>,
      );

      const gameListItemText = result.container.querySelector(
        '.game-list-item-text',
      );
      nameGame = gameListItemText.childNodes[0].nodeValue;

      const gameListItemButton = result.container.querySelector(
        '.game-list-item-button',
      );
      nameButton = gameListItemButton.childNodes[1].data;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a name of the game', () => {
      expect(nameGame).toBe('name fixture');
    });
    it('should return a Join button', () => {
      expect(nameButton).toContain('Join');
    });
  });

  describe('when called, and not exist a game', () => {
    let result;
    let nameGame;

    beforeAll(() => {
      gameListFixture = [];

      result = render(
        <MemoryRouter>
          <GameList status={statusFixture} gameList={gameListFixture} />
        </MemoryRouter>,
      );

      const gameListItemText =
        result.container.querySelector('.game-list-text');
      nameGame = gameListItemText.childNodes[0].nodeValue;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return no games found sentence', () => {
      expect(nameGame).toEqual('No games found.');
    });
  });
});
