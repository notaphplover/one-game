import { beforeAll, describe, it, expect, afterAll, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { RenderResult, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { GameListItem } from './GameListItem';

const TEXT_SHARE_BUTTON = 'Share';
const TEXT_JOIN_BUTTON = 'Join';

describe(GameListItem.name, () => {
  describe('having a nonStarted game', () => {
    let newGame: apiModels.GameV1;

    beforeAll(() => {
      newGame = {
        id: 'id fixture',
        name: 'name fixture',
        state: {
          status: 'nonStarted',
        } as Partial<apiModels.NonStartedGameStateV1> as apiModels.NonStartedGameStateV1,
      };
    });

    describe('when called', () => {
      let nameNewGame: unknown;
      let shareButtonText: unknown;

      beforeAll(() => {
        const renderResult: RenderResult = render(
          <MemoryRouter>
            <GameListItem game={newGame} />
          </MemoryRouter>,
        );

        const textNewGame = renderResult.container.querySelector(
          '.game-list-item-text',
        )?.firstChild;

        nameNewGame = textNewGame?.nodeValue;

        const shareButton = renderResult.container.querySelector(
          '.game-list-item-button',
        )?.childNodes[1];

        shareButtonText = shareButton?.nodeValue;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a name of the game', () => {
        expect(nameNewGame).toBe(newGame.name);
      });

      it('should return a button with Share text', () => {
        expect(shareButtonText).toBe(TEXT_SHARE_BUTTON);
      });
    });
  });

  describe('having a active game', () => {
    let newGame: apiModels.GameV1;

    beforeAll(() => {
      newGame = {
        id: 'id fixture',
        name: 'name fixture',
        state: {
          status: 'active',
        } as Partial<apiModels.ActiveGameStateV1> as apiModels.ActiveGameStateV1,
      };
    });

    describe('when called', () => {
      let nameNewGame: unknown;
      let ButtonText: unknown;

      beforeAll(() => {
        const renderResult: RenderResult = render(
          <MemoryRouter>
            <GameListItem game={newGame} />
          </MemoryRouter>,
        );

        const textNewGame = renderResult.container.querySelector(
          '.game-list-item-text',
        )?.firstChild;

        nameNewGame = textNewGame?.nodeValue;

        const joinButton = renderResult.container.querySelector(
          '.game-list-item-button',
        )?.childNodes[1];

        ButtonText = joinButton?.nodeValue;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a name of the game', () => {
        expect(nameNewGame).toBe(newGame.name);
      });

      it('should return a button with Join text', () => {
        expect(ButtonText).toBe(TEXT_JOIN_BUTTON);
      });
    });
  });
});
