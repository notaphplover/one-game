import { beforeAll, describe, it, expect, afterAll, jest } from '@jest/globals';

jest.mock('./GameListItem');

import { models as apiModels } from '@cornie-js/api-models';
import { RenderResult, render } from '@testing-library/react';
import React from 'react';

import { Left, Right } from '../../common/models/Either';
import { GameList } from './GameList';
import { GameListItem } from './GameListItem';

describe(GameList.name, () => {
  describe('having a null game result with no games', () => {
    describe('when called', () => {
      let gamesListText: unknown;

      beforeAll(() => {
        const renderResult: RenderResult = render(
          <GameList gamesResult={null} />,
        );

        const gamesListTextNode: ChildNode | undefined =
          renderResult.container.querySelector('.game-list-text')
            ?.childNodes[0];

        gamesListText = gamesListTextNode?.nodeValue;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a text node', () => {
        expect(gamesListText).toBe('No games found.');
      });
    });
  });

  describe('having a failed game result', () => {
    let gamesResultFixture: Left<string>;

    beforeAll(() => {
      gamesResultFixture = {
        isRight: false,
        value: 'Error fixture',
      };
    });

    describe('when called', () => {
      let gamesListText: unknown;

      beforeAll(() => {
        const renderResult: RenderResult = render(
          <GameList gamesResult={gamesResultFixture} />,
        );

        const gamesListTextNode: ChildNode | undefined =
          renderResult.container.querySelector('.game-list-text')
            ?.childNodes[0];

        gamesListText = gamesListTextNode?.nodeValue;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a text node', () => {
        expect(gamesListText).toBe(
          'An error has occurred. Please try again later.',
        );
      });
    });
  });

  describe('having a success game result with no games', () => {
    let gamesResultFixture: Right<apiModels.GameV1[]>;

    beforeAll(() => {
      gamesResultFixture = {
        isRight: true,
        value: [],
      };
    });

    describe('when called', () => {
      let gamesListText: unknown;

      beforeAll(() => {
        const renderResult: RenderResult = render(
          <GameList gamesResult={gamesResultFixture} />,
        );

        const gamesListTextNode: ChildNode | undefined =
          renderResult.container.querySelector('.game-list-text')
            ?.childNodes[0];

        gamesListText = gamesListTextNode?.nodeValue;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a text node', () => {
        expect(gamesListText).toBe('No games found.');
      });
    });
  });

  describe('having a success game result with a game', () => {
    let gamesResultFixture: Right<[apiModels.GameV1]>;

    beforeAll(() => {
      gamesResultFixture = {
        isRight: true,
        value: [
          {
            id: 'id fixture',
            name: 'name fixture',
            state: {
              status: 'active',
            } as Partial<apiModels.ActiveGameStateV1> as apiModels.ActiveGameStateV1,
          },
        ],
      };
    });

    describe('when called', () => {
      let expectedGameListItemFixture: ChildNode;
      let gameListItemFixture: React.JSX.Element;

      let gameListItemComponent: unknown;

      beforeAll(() => {
        gameListItemFixture = (
          <div className="game-list-item-mock">Game list item mock</div>
        );

        (GameListItem as jest.Mock<typeof GameListItem>).mockReturnValueOnce(
          gameListItemFixture,
        );

        expectedGameListItemFixture = render(gameListItemFixture).container
          .childNodes[0] as ChildNode;

        const renderResult: RenderResult = render(
          <GameList gamesResult={gamesResultFixture} />,
        );

        gameListItemComponent = renderResult.container.querySelector(
          '.game-list-item-mock',
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call GameListItem()', () => {
        const expectedGame: apiModels.GameV1 = gamesResultFixture.value[0];

        expect(GameListItem).toHaveBeenCalledTimes(1);
        expect(GameListItem).toHaveBeenCalledWith(
          {
            game: expectedGame,
          },
          {},
        );
      });

      it('should render a game list item', () => {
        expect(gameListItemComponent).toStrictEqual(
          expectedGameListItemFixture,
        );
      });
    });
  });
});
