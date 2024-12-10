import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./BaseGameList');

import { render, RenderResult } from '@testing-library/react';
import React from 'react';

import { GameWithSpecPair } from '../models/GameWithSpecPair';
import { BaseGameList, BaseGameListOptions } from './BaseGameList';
import {
  NonStartedGameList,
  NonStartedGameListOptions,
} from './NonStartedGameList';

describe(NonStartedGameList.name, () => {
  let optionsFixture: NonStartedGameListOptions;

  beforeAll(() => {
    optionsFixture = {
      gameResourcesListResult: null,
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
      const expectedOptions: BaseGameListOptions<GameWithSpecPair> = {
        buildGameItem: expect.any(Function) as unknown as (
          gameWithSpecPair: GameWithSpecPair,
          key: number,
        ) => React.JSX.Element,
        gameResourcesListResult: optionsFixture.gameResourcesListResult,
      };

      expect(BaseGameList).toHaveBeenCalledTimes(1);
      expect(BaseGameList).toHaveBeenCalledWith(expectedOptions, undefined);
    });

    it('should return expected content', () => {
      expect(baseGameListContent).toBe(baseGameListContentFixture);
    });
  });
});
