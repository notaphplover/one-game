import { beforeAll, describe, expect, it } from '@jest/globals';

import { Writable } from '@cornie-js/backend-common';

import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardKind } from '../../../cards/domain/valueObjects/CardKind';
import { ActiveGameFixtures } from '../fixtures/ActiveGameFixtures';
import { GameOptionsFixtures } from '../fixtures/GameOptionsFixtures';
import { ActiveGame } from '../models/ActiveGame';
import { ActiveGameSlot } from '../models/ActiveGameSlot';
import { GameOptions } from '../models/GameOptions';
import { CardCanBePlayedSpec } from './CardCanBePlayedSpec';

describe(CardCanBePlayedSpec.name, () => {
  let isCardPlayableSpec: CardCanBePlayedSpec;

  beforeAll(() => {
    isCardPlayableSpec = new CardCanBePlayedSpec();
  });

  describe('.isSatisfiedBy', () => {
    describe('having a game with current draw blue card and draw count greater than zero and options with chain draw card options enabled and play wild draw 4 cards if no other alternative disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentDrawBlueCardAndDrawCountTwo;
        gameOptionsFixture =
          GameOptionsFixtures.withChainAnyDrawCardsEnabledAndPlayWildDraw4IfNoOtherAlternativeDisabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with current draw card and draw count greater than zero and options with chain draw card options disabled and play wild draw 4 cards if no other alternative disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentDrawBlueCardAndDrawCountTwo;
        gameOptionsFixture =
          GameOptionsFixtures.withChainAnyDrawCardsDisabledAndPlayWildDraw4IfNoOtherAlternativeDisabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with current draw card and draw count zero and play wild draw 4 cards if no other alternative disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture =
          ActiveGameFixtures.withCurrentDrawBlueCardAndDrawCountZero;
        gameOptionsFixture =
          GameOptionsFixtures.withPlayWildDraw4IfNoOtherAlternativeDisabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with current wild draw four card and draw count greater than zero and options with chain draw card options enabled and play wild draw 4 cards if no other alternative disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture =
          ActiveGameFixtures.withCurrentWildDraw4CardAndCurrentColorBlueAndDrawCountFour;
        gameOptionsFixture =
          GameOptionsFixtures.withChainAnyDrawCardsEnabledAndPlayWildDraw4IfNoOtherAlternativeDisabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with current wild draw four card and draw count greater than zero and options with chain draw card options disabled and play wild draw 4 cards if no other alternative disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture =
          ActiveGameFixtures.withCurrentWildDraw4CardAndCurrentColorBlueAndDrawCountFour;
        gameOptionsFixture =
          GameOptionsFixtures.withChainAnyDrawCardsDisabledAndPlayWildDraw4IfNoOtherAlternativeDisabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with current wild draw four card and current color blue and draw count zero and options with play wild draw 4 cards if no other alternative disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture =
          ActiveGameFixtures.withCurrentWildDraw4CardAndCurrentColorBlueAndDrawCountZero;
        gameOptionsFixture =
          GameOptionsFixtures.withPlayWildDraw4IfNoOtherAlternativeDisabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with current normal blue two card and options with play wild draw 4 cards if no other alternative disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentNormalBlueTwoCard;
        gameOptionsFixture =
          GameOptionsFixtures.withPlayWildDraw4IfNoOtherAlternativeDisabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with a reverse blue card and options with play wild draw 4 cards if no other alternative disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentReverseBlueCard;
        gameOptionsFixture =
          GameOptionsFixtures.withPlayWildDraw4IfNoOtherAlternativeDisabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with a skip blue card and options with play wild draw 4 cards if no other alternative disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentSkipBlueCard;
        gameOptionsFixture =
          GameOptionsFixtures.withPlayWildDraw4IfNoOtherAlternativeDisabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with current wild card and current color blue and and options with play wild draw 4 cards if no other alternative disabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentWildCardAndCurrentColorBlue;
        gameOptionsFixture =
          GameOptionsFixtures.withPlayWildDraw4IfNoOtherAlternativeDisabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with current normal card current player with no cards and options with play wild draw 4 cards if no other alternative enabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentNormalBlueTwoCard;
        (gameFixture.state.slots[0] as Writable<ActiveGameSlot>).cards = [];
        gameOptionsFixture =
          GameOptionsFixtures.withPlayWildDraw4IfNoOtherAlternativeEnabled;
      });

      describe.each<[string, Card, boolean]>([
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

    describe('having a game with current normal card current player with other playable cards and options with play wild draw 4 cards if no other alternative enabled', () => {
      let gameFixture: ActiveGame;
      let gameOptionsFixture: GameOptions;

      beforeAll(() => {
        gameFixture = ActiveGameFixtures.withCurrentNormalBlueTwoCard;
        (gameFixture.state.slots[0] as Writable<ActiveGameSlot>).cards = [
          {
            kind: CardKind.wild,
          },
        ];
        gameOptionsFixture =
          GameOptionsFixtures.withPlayWildDraw4IfNoOtherAlternativeEnabled;
      });

      describe.each<[string, Card, boolean]>([
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
  });
});
