import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/getSlug');
jest.mock('./BaseGameListItem');

import { render, RenderResult } from '@testing-library/react';
import React from 'react';

import { getSlug } from '../../common/helpers/getSlug';
import { PageName } from '../../common/models/PageName';
import { BaseGameListItem, BaseGameListItemOptions } from './BaseGameListItem';
import {
  NonStartedGameListItem,
  NonStartedGameListItemOptions,
} from './NonStartedGameListItem';

describe(NonStartedGameListItem.name, () => {
  let nonStartedGameListItemOptionsMock: jest.Mocked<NonStartedGameListItemOptions>;

  beforeAll(() => {
    nonStartedGameListItemOptionsMock = {
      buttons: {
        join: { onclick: jest.fn() },
        share: { onclick: jest.fn() },
      },
      game: {
        id: 'id-fixture',
        isPublic: false,
        name: 'name-fixture',
        state: {
          slots: [],
          status: 'nonStarted',
        },
      },
    };
  });

  describe('when called', () => {
    let baseGameListItemContentFixture: string;
    let slugFixture: string;

    let baseGameListItemContent: string | null | undefined;

    beforeAll(() => {
      baseGameListItemContentFixture = 'Expected content fixture';
      slugFixture = '/slug-fixture';

      const baseGameListItemFixture = (
        <div className="base-game-list-item-fixture">
          {baseGameListItemContentFixture}
        </div>
      );

      (
        BaseGameListItem as jest.Mock<typeof BaseGameListItem>
      ).mockReturnValueOnce(baseGameListItemFixture);

      (getSlug as jest.Mock<typeof getSlug>).mockReturnValueOnce(slugFixture);

      const renderResult: RenderResult = render(
        <NonStartedGameListItem {...nonStartedGameListItemOptionsMock} />,
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

    it('should call getSlug()', () => {
      expect(getSlug).toHaveBeenCalledTimes(1);
      expect(getSlug).toHaveBeenCalledWith(PageName.joinGame);
    });

    it('should return expected content', () => {
      expect(baseGameListItemContent).toBe(baseGameListItemContentFixture);
    });
  });
});
