import { beforeAll } from '@jest/globals';
import { ActiveGame } from './ActiveGame';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

describe(ActiveGame.name, () => {
  let newGame;

  beforeAll(() => {
    newGame = {
      id: 'id fixture',
      name: 'name fixture',
    };
  });

  describe('when called, and exist a new game with status active', () => {
    let result;
    let nameNewGame;

    beforeAll(() => {
      result = render(
        <MemoryRouter>
          <ActiveGame game={newGame} />
        </MemoryRouter>,
      );

      const textNewGame = result.container.querySelector('.active-game-text');
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

  describe('when called, and not exist a new game with status active', () => {
    let result;
    let nameNewGame;

    beforeAll(() => {
      newGame = {
        id: null,
        name: null,
      };

      result = render(
        <MemoryRouter>
          <ActiveGame game={newGame} />
        </MemoryRouter>,
      );

      const textNewGame = result.container.querySelector('.active-game-text');
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
