import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./BaseGameListItem');

import { models as apiModels } from '@cornie-js/api-models';
import { render } from '@testing-library/react';

import { ActiveGameListItem } from './ActiveGameListItem';
import { BaseGameListItem, BaseGameListItemOptions } from './BaseGameListItem';

describe(ActiveGameListItem.name, () => {
  let gameFixture: apiModels.GameV1;

  beforeAll(() => {
    gameFixture = {
      id: 'id',
      state: {
        slots: [],
        status: 'nonStarted',
      },
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

      const renderResult = render(<ActiveGameListItem game={gameFixture} />);

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
        game: gameFixture,
      };

      expect(BaseGameListItem).toHaveBeenCalledTimes(1);
      expect(BaseGameListItem).toHaveBeenCalledWith(expectedOptions, {});
    });

    it('should return expected content', () => {
      expect(baseGameListItemContent).toBe(baseGameListItemContentFixture);
    });
  });
});
