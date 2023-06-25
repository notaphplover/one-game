import { CardFixtures } from '../../../cards/domain/fixtures/CardFixtures';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { DrawCard } from '../../../cards/domain/models/DrawCard';
import { NormalCard } from '../../../cards/domain/models/NormalCard';
import { ReverseCard } from '../../../cards/domain/models/ReverseCard';
import { SkipCard } from '../../../cards/domain/models/SkipCard';
import { WildCard } from '../../../cards/domain/models/WildCard';
import { WildDraw4Card } from '../../../cards/domain/models/WildDraw4Card';
import { ActiveGame } from '../models/ActiveGame';
import { GameDirection } from '../models/GameDirection';
import { ActiveGameSlotFixtures } from './ActiveGameSlotFixtures';
import { GameCardSpecFixtures } from './GameCardSpecFixtures';

export class ActiveGameFixtures {
  public static get any(): ActiveGame {
    return {
      gameSlotsAmount: 1,
      id: 'e6b54159-a4ef-41fc-994a-20709526bdaa',
      spec: {
        cards: [GameCardSpecFixtures.any],
      },
      state: {
        active: true,
        currentCard: CardFixtures.any,
        currentColor: CardColor.blue,
        currentDirection: GameDirection.antiClockwise,
        currentPlayingSlotIndex: 0,
        currentTurnCardsPlayed: false,
        deck: [],
        drawCount: 0,
        slots: [ActiveGameSlotFixtures.withPositionZero],
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
}
