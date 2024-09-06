import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./BaseGameListItem');

import { models as apiModels } from '@cornie-js/api-models';
import { render } from '@testing-library/react';

import { ActiveGameListItem } from './ActiveGameListItem';
import { BaseGameListItem, BaseGameListItemOptions } from './BaseGameListItem';

describe(ActiveGameListItem.name, () => {
  let gameV1Fixture: apiModels.GameV1;

  beforeAll(() => {
    gameV1Fixture = {
      id: 'id',
      isPublic: false,
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

      const renderResult = render(<ActiveGameListItem game={gameV1Fixture} />);

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
        gameText: gameV1Fixture.name,
      };

      expect(BaseGameListItem).toHaveBeenCalledTimes(1);
      expect(BaseGameListItem).toHaveBeenCalledWith(expectedOptions, {});
    });

    it('should return expected content', () => {
      expect(baseGameListItemContent).toBe(baseGameListItemContentFixture);
    });
  });
});
