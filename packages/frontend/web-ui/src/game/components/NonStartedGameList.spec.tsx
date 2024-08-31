import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./BaseGameList');

import { models as apiModels } from '@cornie-js/api-models';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';

import { BaseGameList, BaseGameListOptions } from './BaseGameList';
import {
  NonStartedGameList,
  NonStartedGameListOptions,
} from './NonStartedGameList';

describe(NonStartedGameList.name, () => {
  let optionsFixture: NonStartedGameListOptions;

  beforeAll(() => {
    optionsFixture = {
      gamesResult: null,
      usersMeResult: null,
    };
  });

  describe('when called', () => {
    let baseGameListResultFixture: React.JSX.Element;
    let baseGameListContentFixture: string;

    let baseGameListContent: string | null | undefined;

    beforeAll(() => {
      baseGameListContentFixture = 'Expected content fixture';
      baseGameListResultFixture = (
        <div className="base-game-list-fixture">
          {baseGameListContentFixture}
        </div>
      );

      (BaseGameList as jest.Mock<typeof BaseGameList>).mockReturnValueOnce(
        baseGameListResultFixture,
      );

      const renderResult: RenderResult = render(
        <NonStartedGameList {...optionsFixture} />,
      );

      const baseGameList: ChildNode | undefined =
        renderResult.container.querySelector('.base-game-list-fixture')
          ?.childNodes[0];

      baseGameListContent = baseGameList?.nodeValue;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call BaseGameList()', () => {
      const expectedOptions: BaseGameListOptions = {
        buildGameItem: expect.any(Function) as unknown as (
          game: apiModels.GameV1,
          key: number,
        ) => React.JSX.Element,
        gamesResult: optionsFixture.gamesResult,
      };

      expect(BaseGameList).toHaveBeenCalledTimes(1);
      expect(BaseGameList).toHaveBeenCalledWith(expectedOptions, {});
    });

    it('should return expected content', () => {
      expect(baseGameListContent).toBe(baseGameListContentFixture);
    });
  });
});
