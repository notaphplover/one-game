import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./BaseGameListItem');

import { RenderResult, render } from '@testing-library/react';
import React, { MouseEventHandler } from 'react';

import { BaseGameListItem, BaseGameListItemOptions } from './BaseGameListItem';
import {
  NonStartedGameListItem,
  NonStartedGameListItemOptions,
} from './NonStartedGameListItem';

describe(NonStartedGameListItem.name, () => {
  let nonStartedGameListItemOptionsMock: jest.Mocked<NonStartedGameListItemOptions>;

  beforeAll(() => {
    nonStartedGameListItemOptionsMock = {
      game: {
        id: 'id-fixture',
        name: 'name-fixture',
        state: {
          slots: [],
          status: 'nonStarted',
        },
      },
      onButtonClick: jest.fn(),
    };
  });

  describe('when called', () => {
    let baseGameListItemContentFixture: string;

    let baseGameListItemContent: string | null | undefined;

    beforeAll(() => {
      baseGameListItemContentFixture = 'Expected content fixture';

      const baseGameListItemFixture = (
        <div className="base-game-list-item-fixture">
          {baseGameListItemContentFixture}
        </div>
      );

      (
        BaseGameListItem as jest.Mock<typeof BaseGameListItem>
      ).mockReturnValueOnce(baseGameListItemFixture);

      const renderResult: RenderResult = render(
        <NonStartedGameListItem
          game={nonStartedGameListItemOptionsMock.game}
          onButtonClick={
            nonStartedGameListItemOptionsMock.onButtonClick as MouseEventHandler<Element>
          }
        />,
      );

      const baseGameListItem: ChildNode | undefined =
        renderResult.container.querySelector('.base-game-list-item-fixture')
          ?.childNodes[0];

      baseGameListItemContent = baseGameListItem?.nodeValue;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call BaseGameListItem()', () => {
      const expectedOptions: BaseGameListItemOptions = {
        button: expect.anything() as unknown as React.JSX.Element,
        game: nonStartedGameListItemOptionsMock.game,
      };

      expect(BaseGameListItem).toHaveBeenCalledTimes(1);
      expect(BaseGameListItem).toHaveBeenCalledWith(expectedOptions, {});
    });

    it('should return expected content', () => {
      expect(baseGameListItemContent).toBe(baseGameListItemContentFixture);
    });
  });
});
