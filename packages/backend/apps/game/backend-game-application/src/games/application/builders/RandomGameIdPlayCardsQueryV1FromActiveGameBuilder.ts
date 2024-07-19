import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  Card,
  CardRequiresColorChoiceSpec,
} from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  ActiveGameSlot,
  CurrentPlayerCanPlayCardsSpec,
  GameOptions,
  GameService,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

const CARD_COLORS: number = 4;
const BLUE_CARD_COLOR_INDEX: number = 0;
const GREEN_CARD_COLOR_INDEX: number = 1;
const RED_CARD_COLOR_INDEX: number = 2;
const YELLOW_CARD_COLOR_INDEX: number = 3;

@Injectable()
export class RandomGameIdPlayCardsQueryV1FromActiveGameBuilder
  implements
    Builder<
      apiModels.GameIdPlayCardsQueryV1 | undefined,
      [ActiveGame, GameOptions]
    >
{
  readonly #cardRequiresColorChoiceSpec: CardRequiresColorChoiceSpec;
  readonly #currentPlayerCanPlayCardsSpec: CurrentPlayerCanPlayCardsSpec;
  readonly #gameService: GameService;

  constructor(
    @Inject(CardRequiresColorChoiceSpec)
    cardRequiresColorChoiceSpec: CardRequiresColorChoiceSpec,
    @Inject(CurrentPlayerCanPlayCardsSpec)
    currentPlayerCanPlayCardsSpec: CurrentPlayerCanPlayCardsSpec,
    @Inject(GameService)
    gameService: GameService,
  ) {
    this.#cardRequiresColorChoiceSpec = cardRequiresColorChoiceSpec;
    this.#currentPlayerCanPlayCardsSpec = currentPlayerCanPlayCardsSpec;
    this.#gameService = gameService;
  }

  public build(
    activeGame: ActiveGame,
    gameOptions: GameOptions,
  ): apiModels.GameIdPlayCardsQueryV1 | undefined {
    const gameSlot: ActiveGameSlot = this.#gameService.getGameSlotOrThrow(
      activeGame,
      activeGame.state.currentPlayingSlotIndex,
    );

    const validCardIndexes: number[] = [];

    for (let i: number = 0; i < gameSlot.cards.length; ++i) {
      if (
        this.#currentPlayerCanPlayCardsSpec.isSatisfiedBy(
          activeGame,
          gameOptions,
          [i],
        )
      ) {
        validCardIndexes.push(i);
      }
    }

    if (validCardIndexes.length === 0) {
      return undefined;
    } else {
      const randomCardIndex: number = validCardIndexes[
        Math.floor(Math.random() * validCardIndexes.length)
      ] as number;

      const gamePlayCardsUpdateQueryV1: apiModels.GameIdPlayCardsQueryV1 = {
        cardIndexes: [randomCardIndex],
        kind: 'playCards',
        slotIndex: activeGame.state.currentPlayingSlotIndex,
      };

      const card: Card = gameSlot.cards[randomCardIndex] as Card;

      if (this.#cardRequiresColorChoiceSpec.isSatisfiedBy(card)) {
        gamePlayCardsUpdateQueryV1.colorChoice = this.#getRandomColorChoice();
      }

      return gamePlayCardsUpdateQueryV1;
    }
  }

  #getRandomColorChoice(): apiModels.CardColorV1 {
    const randomCardColorIndex: number = Math.floor(
      Math.random() * CARD_COLORS,
    );

    switch (randomCardColorIndex) {
      case BLUE_CARD_COLOR_INDEX:
        return 'blue';
      case GREEN_CARD_COLOR_INDEX:
        return 'green';
      case RED_CARD_COLOR_INDEX:
        return 'red';
      case YELLOW_CARD_COLOR_INDEX:
        return 'yellow';
      default:
        throw new AppError(
          AppErrorKind.unknown,
          'Unexpected result when choosing random color',
        );
    }
  }
}
