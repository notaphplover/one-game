import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { render } from '@testing-library/react';
import React from 'react';

import { Right } from '../../common/models/Either';
import { BaseGameList } from './BaseGameList';

describe(BaseGameList.name, () => {
  let buildGameItemMock: jest.Mock<
    (game: apiModels.GameV1, key: number) => React.JSX.Element
  >;

  beforeAll(() => {
    buildGameItemMock = jest.fn();
  });

  describe('having a null gameResult', () => {
    describe('when called', () => {
      let gamesListTextValue: string | null | undefined;

      beforeAll(() => {
        const renderResult = render(
          <BaseGameList
            buildGameItem={buildGameItemMock}
            gameResourcesListResult={null}
          ></BaseGameList>,
        );

        const gamesListTextNode: ChildNode | undefined =
          renderResult.container.querySelector('.game-list-text')
            ?.childNodes[0];

        gamesListTextValue = gamesListTextNode?.nodeValue;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should render game list text', () => {
        expect(gamesListTextValue).toBe('No games found.');
      });
    });
  });

  describe('having a Left gameResult', () => {
    describe('when called', () => {
      let gamesListTextValue: string | null | undefined;

      beforeAll(() => {
        const renderResult = render(
          <BaseGameList
            buildGameItem={buildGameItemMock}
            gameResourcesListResult={{
              isRight: false,
              value: 'error-message-fixture',
            }}
          ></BaseGameList>,
        );

        const gamesListTextNode: ChildNode | undefined =
          renderResult.container.querySelector('.game-list-text')
            ?.childNodes[0];

        gamesListTextValue = gamesListTextNode?.nodeValue;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should render game list text', () => {
        expect(gamesListTextValue).toBe(
          'An error has occurred. Please try again later.',
        );
      });
    });
  });

  describe('having a Right gameResult', () => {
    let gameFixture: apiModels.GameV1;
    let gameResultFixture: Right<apiModels.GameArrayV1>;

    beforeAll(() => {
      gameFixture = {
        id: 'id-fixture',
        isPublic: false,
        state: {
          slots: [],
          status: 'nonStarted',
        },
      };
      gameResultFixture = {
        isRight: true,
        value: [gameFixture],
      };
    });

    describe('when called', () => {
      let buildGameItemResultFixture: React.JSX.Element;
      let expectedContent: string;

      let gamesListTextValue: string | null | undefined;

      beforeAll(() => {
        expectedContent = 'Mock content';
        buildGameItemResultFixture = (
          <div className="game-mock" key="game-mock-key">
            {expectedContent}
          </div>
        );

        buildGameItemMock.mockReturnValueOnce(buildGameItemResultFixture);

        const renderResult = render(
          <BaseGameList
            buildGameItem={buildGameItemMock}
            gameResourcesListResult={gameResultFixture}
          ></BaseGameList>,
        );

        const gamesListTextNode: ChildNode | undefined =
          renderResult.container.querySelector('.game-mock')?.childNodes[0];

        gamesListTextValue = gamesListTextNode?.nodeValue;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildGameItem()', () => {
        expect(buildGameItemMock).toHaveBeenCalledTimes(1);
        expect(buildGameItemMock).toHaveBeenCalledWith(gameFixture, 0);
      });

      it('should render game list text', () => {
        expect(gamesListTextValue).toBe(expectedContent);
      });
    });
  });
});
