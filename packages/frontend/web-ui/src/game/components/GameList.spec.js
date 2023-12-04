import { beforeAll } from '@jest/globals';
import { GameList } from './GameList';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

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

  describe('when called, and exist a new game with status nonStarted', () => {
    let result;
    let nameNewGame;

    beforeAll(() => {
      result = render(
        <MemoryRouter>
          <GameList typeGame={newTypeGame} game={newGame} />
        </MemoryRouter>,
      );

      const textNewGame = result.container.querySelector('.game-list-text');
      nameNewGame = textNewGame.firstChild.data;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a name of the game', () => {
      expect(nameNewGame).toBe('name fixture');
    });
  });

  describe('when called, and not exist a new game with status nonStarted', () => {
    let result;
    let nameNewGame;

    beforeAll(() => {
      newGame = {
        id: null,
        name: null,
      };

      newTypeGame = 'nonStarted';

      result = render(
        <MemoryRouter>
          <GameList typeGame={newTypeGame} game={newGame} />
        </MemoryRouter>,
      );

      const textNewGame = result.container.querySelector('.game-list-text');
      nameNewGame = textNewGame.firstChild;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a null value for name of the game', () => {
      expect(nameNewGame).toBeNull();
    });
  });
});
