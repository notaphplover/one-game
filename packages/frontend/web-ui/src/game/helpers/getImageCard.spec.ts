import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { getImageCard, KindCard } from './getImageCard';

describe(getImageCard.name, () => {
  let kindFixture: KindCard;

  describe('having a kind with value draw', () => {
    let result: string;

    beforeAll(() => {
      kindFixture = 'draw';
      result = getImageCard(kindFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a path to Draw card image', () => {
      const imagePath = '/src/app/images/draw.ico';
      expect(result).toStrictEqual(imagePath);
    });
  });

  describe('having a kind with value wild', () => {
    let result: string;

    beforeAll(() => {
      kindFixture = 'wild';
      result = getImageCard(kindFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a path to Wild card image', () => {
      const imagePath = '/src/app/images/wild.ico';
      expect(result).toStrictEqual(imagePath);
    });
  });

  describe('having a kind with value reverse', () => {
    let result: string;

    beforeAll(() => {
      kindFixture = 'reverse';
      result = getImageCard(kindFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a path to Reverse card image', () => {
      const imagePath = '/src/app/images/reverse.ico';
      expect(result).toStrictEqual(imagePath);
    });
  });

  describe('having a kind with value skip', () => {
    let result: string;

    beforeAll(() => {
      kindFixture = 'skip';
      result = getImageCard(kindFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a path to Skip card image', () => {
      const imagePath = '/src/app/images/skip.ico';
      expect(result).toStrictEqual(imagePath);
    });
  });

  describe('having a kind with value wildDraw4', () => {
    let result: string;

    beforeAll(() => {
      kindFixture = 'wildDraw4';
      result = getImageCard(kindFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a path to WildDraw4 card image', () => {
      const imagePath = '/src/app/images/wildDraw4.ico';
      expect(result).toStrictEqual(imagePath);
    });
  });
});
