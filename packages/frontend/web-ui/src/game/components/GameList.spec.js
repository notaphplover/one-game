import { beforeAll, describe, it, expect } from '@jest/globals';
import { GameList } from './GameList';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

describe(GameList.name, () => {
  let newGame;
  let newTypeGame;

  beforeAll(() => {
    newGame = {
      id: 'id fixture',
      name: 'name fixture',
    };
    newTypeGame = 'nonStarted';
  });

  describe('when called, and exist a game with status nonStarted and Join button is hide', () => {
    let result;
    let nameNewGame;
    let classNameJoinButton;

    beforeAll(() => {
      result = render(
        <MemoryRouter>
          <GameList typeGame={newTypeGame} game={newGame} />
        </MemoryRouter>,
      );

      const textNewGame = result.container.querySelector('.game-list-text');
      nameNewGame = textNewGame.firstChild.data;

      const activeGameJoinButton = result.container.querySelector(
        '.hide-button-active-game',
      );
      classNameJoinButton = activeGameJoinButton.className;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a name of the game', () => {
      expect(nameNewGame).toBe('name fixture');
    });

    it('should return a Join button className to hide component', () => {
      expect(classNameJoinButton).toContain('hide-button-active-game');
    });
  });

  describe('when called, and exist a game with status active and Share button is hide', () => {
    let result;
    let nameNewGame;
    let classNameShareButton;

    beforeAll(() => {
      newTypeGame = 'active';

      result = render(
        <MemoryRouter>
          <GameList typeGame={newTypeGame} game={newGame} />
        </MemoryRouter>,
      );

      const textNewGame = result.container.querySelector('.game-list-text');
      nameNewGame = textNewGame.firstChild.data;

      const pendingGameShareButton = result.container.querySelector(
        '.hide-button-pending-game',
      );
      classNameShareButton = pendingGameShareButton.className;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a name of the game', () => {
      expect(nameNewGame).toBe('name fixture');
    });

    it('should return a Share button className to hide component', () => {
      expect(classNameShareButton).toContain('hide-button-pending-game');
    });
  });

  describe('when called, and exist a game without status and Join and Share buttons are hide', () => {
    let result;
    let nameNewGame;
    let classNameJoinButton;
    let classNameShareButton;

    beforeAll(() => {
      newTypeGame = null;

      result = render(
        <MemoryRouter>
          <GameList typeGame={newTypeGame} game={newGame} />
        </MemoryRouter>,
      );

      const textNewGame = result.container.querySelector('.game-list-text');
      nameNewGame = textNewGame.firstChild.data;

      const pendingGameShareButton = result.container.querySelector(
        '.hide-button-pending-game',
      );
      classNameShareButton = pendingGameShareButton.className;

      const activeGameJoinButton = result.container.querySelector(
        '.hide-button-active-game',
      );
      classNameJoinButton = activeGameJoinButton.className;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a name of the game', () => {
      expect(nameNewGame).toBe('name fixture');
    });

    it('should return a Share button className to hide component', () => {
      expect(classNameShareButton).toContain('hide-button-pending-game');
    });

    it('should return a Join button className to hide component', () => {
      expect(classNameJoinButton).toContain('hide-button-active-game');
    });
  });
});
