import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { DrawCard } from '../../../cards/domain/valueObjects/DrawCard';
import { NormalCard } from '../../../cards/domain/valueObjects/NormalCard';
import { ReverseCard } from '../../../cards/domain/valueObjects/ReverseCard';
import { SkipCard } from '../../../cards/domain/valueObjects/SkipCard';
import { WildCard } from '../../../cards/domain/valueObjects/WildCard';
import { WildDraw4Card } from '../../../cards/domain/valueObjects/WildDraw4Card';
import { ActiveGame } from '../entities/ActiveGame';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameStatus } from '../valueObjects/GameStatus';
import { ActiveGameSlotFixtures } from './ActiveGameSlotFixtures';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';
import { GameSpecFixtures } from './GameSpecFixtures';

export class ActiveGameFixtures {
  public static get any(): ActiveGame {
    return {
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      spec: GameSpecFixtures.withGameSlotsAmountOne,
      state: {
        currentCard: CardFixtures.any,
        currentColor: CardColor.blue,
        currentDirection: GameDirection.antiClockwise,
        currentPlayingSlotIndex: 0,
        currentTurnCardsPlayed: false,
        deck: [],
        discardPile: [],
        drawCount: 0,
        slots: [ActiveGameSlotFixtures.withPositionZero],
        status: GameStatus.active,
      },
    };
  }

  public static get withCurrentDrawBlueCardAndDrawCountTwo(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;
    const drawCardFixture: DrawCard = CardFixtures.drawBlueCard;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentCard: CardFixtures.drawCard,
        currentColor: drawCardFixture.color,
        drawCount: 2,
      },
    };
  }

  public static get withCurrentDrawBlueCardAndDrawCountZero(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;
    const drawCardFixture: DrawCard = CardFixtures.drawBlueCard;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentCard: drawCardFixture,
        currentColor: drawCardFixture.color,
        drawCount: 0,
      },
    };
  }

  public static get withCurrentNormalBlueTwoCard(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;
    const normalBlueTwoCard: NormalCard = CardFixtures.normalBlueTwoCard;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentCard: normalBlueTwoCard,
        currentColor: normalBlueTwoCard.color,
      },
    };
  }

  public static get withCurrentReverseBlueCard(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;
    const reverseBlueCard: ReverseCard = CardFixtures.reverseBlueCard;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentCard: reverseBlueCard,
        currentColor: reverseBlueCard.color,
      },
    };
  }

  public static get withCurrentSkipBlueCard(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;
    const skipBlueCard: SkipCard = CardFixtures.skipBlueCard;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentCard: skipBlueCard,
        currentColor: skipBlueCard.color,
      },
    };
  }

  public static get withCurrentWildCardAndCurrentColorBlue(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;
    const wildCardFixture: WildCard = CardFixtures.wildCard;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentCard: wildCardFixture,
        currentColor: CardColor.blue,
      },
    };
  }

  public static get withCurrentWildDraw4CardAndCurrentColorBlueAndDrawCountFour(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;
    const wildDraw4CardFixture: WildDraw4Card = CardFixtures.wildDraw4Card;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentCard: wildDraw4CardFixture,
        currentColor: CardColor.blue,
        drawCount: 4,
      },
    };
  }

  public static get withCurrentWildDraw4CardAndCurrentColorBlueAndDrawCountZero(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;
    const wildDraw4CardFixture: WildDraw4Card = CardFixtures.wildDraw4Card;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentCard: wildDraw4CardFixture,
        currentColor: CardColor.blue,
        drawCount: 0,
      },
    };
  }

  public static get withGameSlotsAmountTwoAndDeckWithSpecOneWithAmount120(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;

    return {
      ...anyActiveGameFixture,
      spec: {
        cards: [GameCardSpecFixtures.withAmount120],
        gameSlotsAmount: 2,
      },
      state: {
        ...anyActiveGameFixture.state,
        slots: [
          ActiveGameSlotFixtures.withPositionZero,
          ActiveGameSlotFixtures.withPositionOne,
        ],
      },
    };
  }

  public static get withSlotsOne(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        slots: [ActiveGameSlotFixtures.withPositionZero],
      },
    };
  }

  public static get withSlotsTwoAndCurrentPlayingSlotZero(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.any;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentPlayingSlotIndex: 0,
        slots: [
          ActiveGameSlotFixtures.withPositionZero,
          ActiveGameSlotFixtures.withPositionOne,
        ],
      },
    };
  }

  public static get withSlotsOneAndCurrentDirectionAntiClockwise(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.withSlotsOne;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentDirection: GameDirection.antiClockwise,
      },
    };
  }

  public static get withSlotsOneAndCurrentDirectionClockwise(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.withSlotsOne;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentDirection: GameDirection.clockwise,
      },
    };
  }

  public static get withSlotsOneAndCurrentTurnCardsPlayedFalse(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.withSlotsOne;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentTurnCardsPlayed: false,
      },
    };
  }

  public static get withSlotsOneAndCurrentTurnCardsPlayedTrue(): ActiveGame {
    const anyActiveGameFixture: ActiveGame = ActiveGameFixtures.withSlotsOne;

    return {
      ...anyActiveGameFixture,
      state: {
        ...anyActiveGameFixture.state,
        currentTurnCardsPlayed: true,
      },
    };
  }
}
