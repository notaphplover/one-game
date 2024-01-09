import { beforeAll, describe, it, expect } from '@jest/globals';
import { GameListItem } from './GameListItem';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

const TEXT_SHARE_BUTTON = 'Share';
const TEXT_JOIN_BUTTON = 'Join';

describe(GameListItem.name, () => {
  let newGame;

  beforeAll(() => {
    newGame = {
      id: 'id fixture',
      name: 'name fixture',
      state: {
        status: 'nonStarted',
      },
    };
  });

  describe('when called, and exist a game with status nonStarted and Share button is visible', () => {
    let result;
    let nameNewGame;
    let shareButtonText;

    beforeAll(() => {
      result = render(
        <MemoryRouter>
          <GameListItem game={newGame} />
        </MemoryRouter>,
      );

      const textNewGame = result.container.querySelector(
        '.game-list-item-text',
      );
      nameNewGame = textNewGame.firstChild.data;

      const shareButton = result.container.querySelector(
        '.game-list-item-button',
      );
      shareButtonText = shareButton.childNodes[1].data;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a name of the game', () => {
      expect(nameNewGame).toBe(newGame.name);
    });

    it('should return a button with Share text', () => {
      expect(shareButtonText).toBe(TEXT_SHARE_BUTTON);
    });
  });

  describe('when called, and exist a game with status active and Join button is visible', () => {
    let result;
    let nameNewGame;
    let joinButtonText;

    beforeAll(() => {
      newGame.state.status = 'active';

      result = render(
        <MemoryRouter>
          <GameListItem game={newGame} />
        </MemoryRouter>,
      );

      const textNewGame = result.container.querySelector(
        '.game-list-item-text',
      );
      nameNewGame = textNewGame.firstChild.data;

      const joinButton = result.container.querySelector(
        '.game-list-item-button',
      );
      joinButtonText = joinButton.childNodes[1].data;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return a name of the game', () => {
      expect(nameNewGame).toBe('name fixture');
    });

    it('should return a Share button className to hide component', () => {
      expect(joinButtonText).toBe(TEXT_JOIN_BUTTON);
    });
  });
});
