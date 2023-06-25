import { beforeAll, describe, expect, it } from '@jest/globals';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { Card } from '../../../cards/domain/models/Card';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { GameOptionsFixtures } from '../fixtures/GameOptionsFixtures';
import { ActiveGame } from '../models/ActiveGame';
import { GameOptions } from '../models/GameOptions';
import { IsCardPlayableSpec } from './IsCardPlayableSpec';

describe(IsCardPlayableSpec.name, () => {
  let isCardPlayableSpec: IsCardPlayableSpec;

  beforeAll(() => {
    isCardPlayableSpec = new IsCardPlayableSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe('having a game with current draw blue card and draw count greater than zero and options with chain draw card options enabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentDrawBlueCardAndDrawCountTwo;
        gameOptionsFixture = GameOptionsFixtures.withChainAnyDrawCardsEnabled;
      });

      describe.each<[string, Card, boolean]>([
        ['blank card', CardFixtures.blankCard, false],
        ['draw blue card', CardFixtures.drawBlueCard, true],
        ['draw red card', CardFixtures.drawRedCard, true],
        ['normal card', CardFixtures.normalCard, false],
        ['reverse card', CardFixtures.reverseCard, false],
        ['skip card', CardFixtures.skipCard, false],
        ['wild card', CardFixtures.wildCard, false],
        ['wild draw 4 card', CardFixtures.wildDraw4Card, true],
      ])(
        'having a %s',
        (_: string, cardFixture: Card, expectedResult: boolean) => {
          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = isCardPlayableSpec.isSatisfiedBy(
                cardFixture,
                gameFixture,
                gameOptionsFixture,
              );
            });

            it(`should return  ${expectedResult.toString()}`, () => {
              expect(result).toBe(expectedResult);
            });
          });
        },
      );
    });

    describe('having a game with current draw card and draw count greater than zero and options with chain draw card options disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentDrawBlueCardAndDrawCountTwo;
        gameOptionsFixture = GameOptionsFixtures.withChainAnyDrawCardsDisabled;
      });

      describe.each<[string, Card, boolean]>([
        ['blank card', CardFixtures.blankCard, false],
        ['draw card', CardFixtures.drawCard, false],
        ['normal card', CardFixtures.normalCard, false],
        ['reverse card', CardFixtures.reverseCard, false],
        ['skip card', CardFixtures.skipCard, false],
        ['wild card', CardFixtures.wildCard, false],
        ['wild draw 4 card', CardFixtures.wildDraw4Card, false],
      ])(
        'having a %s',
        (_: string, cardFixture: Card, expectedResult: boolean) => {
          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = isCardPlayableSpec.isSatisfiedBy(
                cardFixture,
                gameFixture,
                gameOptionsFixture,
              );
            });

            it(`should return  ${expectedResult.toString()}`, () => {
              expect(result).toBe(expectedResult);
            });
          });
        },
      );
    });

    describe('having a game with current draw card and draw count zero', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture =
          ActiveGameFixtures.withCurrentDrawBlueCardAndDrawCountZero;
        gameOptionsFixture = GameOptionsFixtures.any;
      });

      describe.each<[string, Card, boolean]>([
        ['blank card', CardFixtures.blankCard, true],
        ['draw blue card', CardFixtures.drawBlueCard, true],
        ['draw red card', CardFixtures.drawRedCard, true],
        ['normal blue card', CardFixtures.normalBlueCard, true],
        ['normal red card', CardFixtures.normalRedCard, false],
        ['reverse blue card', CardFixtures.reverseBlueCard, true],
        ['reverse red card', CardFixtures.reverseRedCard, false],
        ['skip blue card', CardFixtures.skipBlueCard, true],
        ['skip red card', CardFixtures.skipRedCard, false],
        ['wild card', CardFixtures.wildCard, true],
        ['wild draw 4 card', CardFixtures.wildDraw4Card, true],
      ])(
        'having a %s',
        (_: string, cardFixture: Card, expectedResult: boolean) => {
          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = isCardPlayableSpec.isSatisfiedBy(
                cardFixture,
                gameFixture,
                gameOptionsFixture,
              );
            });

            it(`should return  ${expectedResult.toString()}`, () => {
              expect(result).toBe(expectedResult);
            });
          });
        },
      );
    });

    describe('having a game with current wild draw four card and draw count greater than zero and options with chain draw card options enabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture =
          ActiveGameFixtures.withCurrentWildDraw4CardAndCurrentColorBlueAndDrawCountFour;
        gameOptionsFixture = GameOptionsFixtures.withChainAnyDrawCardsEnabled;
      });

      describe.each<[string, Card, boolean]>([
        ['blank card', CardFixtures.blankCard, false],
        ['draw blue card', CardFixtures.drawBlueCard, true],
        ['draw red card', CardFixtures.drawRedCard, false],
        ['normal card', CardFixtures.normalCard, false],
        ['reverse card', CardFixtures.reverseCard, false],
        ['skip card', CardFixtures.skipCard, false],
        ['wild card', CardFixtures.wildCard, false],
        ['wild draw 4 card', CardFixtures.wildDraw4Card, true],
      ])(
        'having a %s',
        (_: string, cardFixture: Card, expectedResult: boolean) => {
          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = isCardPlayableSpec.isSatisfiedBy(
                cardFixture,
                gameFixture,
                gameOptionsFixture,
              );
            });

            it(`should return  ${expectedResult.toString()}`, () => {
              expect(result).toBe(expectedResult);
            });
          });
        },
      );
    });

    describe('having a game with current wild draw four card and draw count greater than zero and options with chain draw card options disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture =
          ActiveGameFixtures.withCurrentWildDraw4CardAndCurrentColorBlueAndDrawCountFour;
        gameOptionsFixture = GameOptionsFixtures.withChainAnyDrawCardsDisabled;
      });

      describe.each<[string, Card, boolean]>([
        ['blank card', CardFixtures.blankCard, false],
        ['draw blue card', CardFixtures.drawBlueCard, false],
        ['draw red card', CardFixtures.drawRedCard, false],
        ['normal card', CardFixtures.normalCard, false],
        ['reverse card', CardFixtures.reverseCard, false],
        ['skip card', CardFixtures.skipCard, false],
        ['wild card', CardFixtures.wildCard, false],
        ['wild draw 4 card', CardFixtures.wildDraw4Card, false],
      ])(
        'having a %s',
        (_: string, cardFixture: Card, expectedResult: boolean) => {
          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = isCardPlayableSpec.isSatisfiedBy(
                cardFixture,
                gameFixture,
                gameOptionsFixture,
              );
            });

            it(`should return  ${expectedResult.toString()}`, () => {
              expect(result).toBe(expectedResult);
            });
          });
        },
      );
    });

    describe('having a game with current wild draw four card and current color blue and draw count zero', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture =
          ActiveGameFixtures.withCurrentWildDraw4CardAndCurrentColorBlueAndDrawCountZero;
        gameOptionsFixture = GameOptionsFixtures.any;
      });

      describe.each<[string, Card, boolean]>([
        ['blank card', CardFixtures.blankCard, true],
        ['draw blue card', CardFixtures.drawBlueCard, true],
        ['draw red card', CardFixtures.drawRedCard, false],
        ['normal blue card', CardFixtures.normalBlueCard, true],
        ['normal red card', CardFixtures.normalRedCard, false],
        ['reverse blue card', CardFixtures.reverseBlueCard, true],
        ['reverse red card', CardFixtures.reverseRedCard, false],
        ['skip blue card', CardFixtures.skipBlueCard, true],
        ['skip red card', CardFixtures.skipRedCard, false],
        ['wild card', CardFixtures.wildCard, true],
        ['wild draw 4 card', CardFixtures.wildDraw4Card, true],
      ])(
        'having a %s',
        (_: string, cardFixture: Card, expectedResult: boolean) => {
          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = isCardPlayableSpec.isSatisfiedBy(
                cardFixture,
                gameFixture,
                gameOptionsFixture,
              );
            });

            it(`should return  ${expectedResult.toString()}`, () => {
              expect(result).toBe(expectedResult);
            });
          });
        },
      );
    });

    describe('having a game with current normal blue two card', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentNormalBlueTwoCard;
        gameOptionsFixture = GameOptionsFixtures.any;
      });

      describe.each<[string, Card, boolean]>([
        ['blank card', CardFixtures.blankCard, true],
        ['draw blue card', CardFixtures.drawBlueCard, true],
        ['draw red card', CardFixtures.drawRedCard, false],
        ['normal blue two card', CardFixtures.normalBlueTwoCard, true],
        ['normal blue seven card', CardFixtures.normalBlueSevenCard, true],
        ['normal red two card', CardFixtures.normalRedTwoCard, true],
        ['normal red seven card', CardFixtures.normalRedSevenCard, false],
        ['reverse blue card', CardFixtures.reverseBlueCard, true],
        ['reverse red card', CardFixtures.reverseRedCard, false],
        ['skip blue card', CardFixtures.skipBlueCard, true],
        ['skip red card', CardFixtures.skipRedCard, false],
        ['wild card', CardFixtures.wildCard, true],
        ['wild draw 4 card', CardFixtures.wildDraw4Card, true],
      ])(
        'having a %s',
        (_: string, cardFixture: Card, expectedResult: boolean) => {
          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = isCardPlayableSpec.isSatisfiedBy(
                cardFixture,
                gameFixture,
                gameOptionsFixture,
              );
            });

            it(`should return  ${expectedResult.toString()}`, () => {
              expect(result).toBe(expectedResult);
            });
          });
        },
      );
    });

    describe('having a game with a reverse blue card', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentReverseBlueCard;
        gameOptionsFixture = GameOptionsFixtures.any;
      });

      describe.each<[string, Card, boolean]>([
        ['blank card', CardFixtures.blankCard, true],
        ['draw blue card', CardFixtures.drawBlueCard, true],
        ['draw red card', CardFixtures.drawRedCard, false],
        ['normal blue card', CardFixtures.normalBlueCard, true],
        ['normal red card', CardFixtures.normalRedCard, false],
        ['reverse blue card', CardFixtures.reverseBlueCard, true],
        ['reverse red card', CardFixtures.reverseRedCard, true],
        ['skip blue card', CardFixtures.skipBlueCard, true],
        ['skip red card', CardFixtures.skipRedCard, false],
        ['wild card', CardFixtures.wildCard, true],
        ['wild draw 4 card', CardFixtures.wildDraw4Card, true],
      ])(
        'having a %s',
        (_: string, cardFixture: Card, expectedResult: boolean) => {
          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = isCardPlayableSpec.isSatisfiedBy(
                cardFixture,
                gameFixture,
                gameOptionsFixture,
              );
            });

            it(`should return  ${expectedResult.toString()}`, () => {
              expect(result).toBe(expectedResult);
            });
          });
        },
      );
    });

    describe('having a game with a skip blue card', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentSkipBlueCard;
        gameOptionsFixture = GameOptionsFixtures.any;
      });

      describe.each<[string, Card, boolean]>([
        ['blank card', CardFixtures.blankCard, true],
        ['draw blue card', CardFixtures.drawBlueCard, true],
        ['draw red card', CardFixtures.drawRedCard, false],
        ['normal blue card', CardFixtures.normalBlueCard, true],
        ['normal red card', CardFixtures.normalRedCard, false],
        ['reverse blue card', CardFixtures.reverseBlueCard, true],
        ['reverse red card', CardFixtures.reverseRedCard, false],
        ['skip blue card', CardFixtures.skipBlueCard, true],
        ['skip red card', CardFixtures.skipRedCard, true],
        ['wild card', CardFixtures.wildCard, true],
        ['wild draw 4 card', CardFixtures.wildDraw4Card, true],
      ])(
        'having a %s',
        (_: string, cardFixture: Card, expectedResult: boolean) => {
          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = isCardPlayableSpec.isSatisfiedBy(
                cardFixture,
                gameFixture,
                gameOptionsFixture,
              );
            });

            it(`should return  ${expectedResult.toString()}`, () => {
              expect(result).toBe(expectedResult);
            });
          });
        },
      );
    });

    describe('having a game with current wild card and current color blue', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentWildCardAndCurrentColorBlue;
        gameOptionsFixture = GameOptionsFixtures.any;
      });

      describe.each<[string, Card, boolean]>([
        ['blank card', CardFixtures.blankCard, true],
        ['draw blue card', CardFixtures.drawBlueCard, true],
        ['draw red card', CardFixtures.drawRedCard, false],
        ['normal blue card', CardFixtures.normalBlueCard, true],
        ['normal red card', CardFixtures.normalRedCard, false],
        ['reverse blue card', CardFixtures.reverseBlueCard, true],
        ['reverse red card', CardFixtures.reverseRedCard, false],
        ['skip blue card', CardFixtures.skipBlueCard, true],
        ['skip red card', CardFixtures.skipRedCard, false],
        ['wild card', CardFixtures.wildCard, true],
        ['wild draw 4 card', CardFixtures.wildDraw4Card, true],
      ])(
        'having a %s',
        (_: string, cardFixture: Card, expectedResult: boolean) => {
          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              result = isCardPlayableSpec.isSatisfiedBy(
                cardFixture,
                gameFixture,
                gameOptionsFixture,
              );
            });

            it(`should return  ${expectedResult.toString()}`, () => {
              expect(result).toBe(expectedResult);
            });
          });
        },
      );
    });
  });
});
