jest.mock('../../app/images/cards/draw.svg', () => 'draw-url-fixture', {
  virtual: true,
});
jest.mock('../../app/images/cards/reverse.svg', () => 'reverse-url-fixture', {
  virtual: true,
});
jest.mock('../../app/images/cards/skip.svg', () => 'skip-url-fixture', {
  virtual: true,
});
jest.mock('../../app/images/cards/wild.svg', () => 'wild-url-fixture', {
  virtual: true,
});
jest.mock(
  '../../app/images/cards/wildDraw4.svg',
  () => 'wild-draw-4-url-fixture',
  {
    virtual: true,
  },
);

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';

import drawCardImageUrl from '../../app/images/cards/draw.svg';
import reverseCardImageUrl from '../../app/images/cards/reverse.svg';
import skipCardImageUrl from '../../app/images/cards/skip.svg';
import wildCardImageUrl from '../../app/images/cards/wild.svg';
import wildDraw4CardImageUrl from '../../app/images/cards/wildDraw4.svg';
import { getImageCardUrl } from './getImageCardUrl';

describe(getImageCardUrl.name, () => {
  let cardFixture: apiModels.CardV1;

  describe('having a kind with value draw', () => {
    let result: string;

    beforeAll(() => {
      cardFixture = {
        color: 'blue',
        kind: 'draw',
      };
      result = getImageCardUrl(cardFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a path to Draw card image', () => {
      expect(result).toBe(drawCardImageUrl);
    });
  });

  describe('having a kind with value reverse', () => {
    let result: string;

    beforeAll(() => {
      cardFixture = {
        color: 'blue',
        kind: 'reverse',
      };
      result = getImageCardUrl(cardFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a path to Reverse card image', () => {
      expect(result).toStrictEqual(reverseCardImageUrl);
    });
  });

  describe('having a kind with value skip', () => {
    let result: string;

    beforeAll(() => {
      cardFixture = {
        color: 'blue',
        kind: 'skip',
      };
      result = getImageCardUrl(cardFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a path to Skip card image', () => {
      expect(result).toStrictEqual(skipCardImageUrl);
    });
  });

  describe('having a kind with value wild', () => {
    let result: string;

    beforeAll(() => {
      cardFixture = {
        kind: 'wild',
      };
      result = getImageCardUrl(cardFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a path to Wild card image', () => {
      expect(result).toStrictEqual(wildCardImageUrl);
    });
  });

  describe('having a kind with value wildDraw4', () => {
    let result: string;

    beforeAll(() => {
      cardFixture = {
        kind: 'wildDraw4',
      };
      result = getImageCardUrl(cardFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a path to WildDraw4 card image', () => {
      expect(result).toStrictEqual(wildDraw4CardImageUrl);
    });
  });
});
