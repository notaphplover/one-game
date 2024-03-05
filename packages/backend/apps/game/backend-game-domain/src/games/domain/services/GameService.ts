import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { AreCardsEqualsSpec } from '../../../cards/domain/specs/AreCardsEqualsSpec';
import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { CardKind } from '../../../cards/domain/valueObjects/CardKind';
import { ColoredCard } from '../../../cards/domain/valueObjects/ColoredCard';
import { ActiveGame } from '../entities/ActiveGame';
import { Game } from '../entities/Game';
import { NonStartedGame } from '../entities/NonStartedGame';
import { GameSlotUpdateQuery } from '../query/GameSlotUpdateQuery';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameInitialDrawsMutation } from '../valueObjects/GameInitialDrawsMutation';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameStatus } from '../valueObjects/GameStatus';
import { NonStartedGameSlot } from '../valueObjects/NonStartedGameSlot';
import { GameDrawService } from './GameDrawService';

const UNO_ORIGINAL_ACTION_CARDS_PER_COLOR: number = 2;
const UNO_ORIGINAL_FIRST_TURN: number = 1;
const UNO_ORIGINAL_NUMBERS_AMOUNT: number = 10;
const UNO_ORIGINAL_NUMBERED_NON_ZERO_CARDS_PER_COLOR: number = 2;
const UNO_ORIGINAL_NUMBERED_ZERO_CARDS_PER_COLOR: number = 1;
const UNO_ORIGINAL_WILD_CARDS_PER_COLOR: number = 4;

@Injectable()
export class GameService {
  readonly #areCardsEqualsSpec: AreCardsEqualsSpec;
  readonly #gameDrawService: GameDrawService;

  constructor(
    @Inject(AreCardsEqualsSpec)
    areCardsEqualsSpec: AreCardsEqualsSpec,
    @Inject(GameDrawService)
    gameDrawService: GameDrawService,
  ) {
    this.#areCardsEqualsSpec = areCardsEqualsSpec;
    this.#gameDrawService = gameDrawService;
  }

  public buildStartGameUpdateQuery(
    game: NonStartedGame,
    gameSpec: GameSpec,
  ): GameUpdateQuery {
    const gameInitialDraws: GameInitialDrawsMutation =
      this.#gameDrawService.calculateInitialCardsDrawMutation(gameSpec);

    const gameSlotUpdateQueries: GameSlotUpdateQuery[] =
      gameInitialDraws.cards.map(
        (cards: Card[], index: number): GameSlotUpdateQuery => ({
          cards: cards,
          gameSlotFindQuery: {
            gameId: game.id,
            position: index,
          },
        }),
      );

    const gameUpdateQuery: GameUpdateQuery = {
      currentCard: gameInitialDraws.currentCard,
      currentColor: this.#getInitialCardColor(gameInitialDraws.currentCard),
      currentDirection: this.#getInitialDirection(),
      currentPlayingSlotIndex: this.#getInitialPlayingSlotIndex(),
      currentTurnCardsDrawn: false,
      currentTurnCardsPlayed: false,
      deck: gameInitialDraws.deck,
      drawCount: this.#getInitialDrawCount(),
      gameFindQuery: {
        id: game.id,
      },
      gameSlotUpdateQueries,
      skipCount: 0,
      status: GameStatus.active,
      turn: UNO_ORIGINAL_FIRST_TURN,
    };

    return gameUpdateQuery;
  }

  public getGameSlotOrThrow(game: ActiveGame, index: number): ActiveGameSlot;
  public getGameSlotOrThrow(
    game: NonStartedGame,
    index: number,
  ): NonStartedGameSlot;
  public getGameSlotOrThrow(
    game: Game,
    index: number,
  ): ActiveGameSlot | NonStartedGameSlot {
    const gameSlot: ActiveGameSlot | NonStartedGameSlot | undefined =
      game.state.slots[index];

    if (gameSlot === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        `Expecting a game slot at index "${index}", none found instead.`,
      );
    }

    return gameSlot;
  }

  public getInitialCardsSpec(): GameCardSpec[] {
    const [zeroNumber, ...nonZeroNumbers]: [number, ...number[]] = new Array(
      UNO_ORIGINAL_NUMBERS_AMOUNT,
    )
      .fill(null)
      .map((_: unknown, index: number) => index) as [number, ...number[]];

    const actionCardKinds: (
      | CardKind.draw
      | CardKind.reverse
      | CardKind.skip
    )[] = [CardKind.draw, CardKind.reverse, CardKind.skip];

    const wildCardKinds: (CardKind.wild | CardKind.wildDraw4)[] = [
      CardKind.wild,
      CardKind.wildDraw4,
    ];

    return [
      ...Object.values(CardColor).map(
        (color: CardColor): GameCardSpec => ({
          amount: UNO_ORIGINAL_NUMBERED_ZERO_CARDS_PER_COLOR,
          card: {
            color,
            kind: CardKind.normal,
            number: zeroNumber,
          },
        }),
      ),
      ...Object.values(CardColor)
        .map((color: CardColor): GameCardSpec[] =>
          nonZeroNumbers.map(
            (number: number): GameCardSpec => ({
              amount: UNO_ORIGINAL_NUMBERED_NON_ZERO_CARDS_PER_COLOR,
              card: {
                color,
                kind: CardKind.normal,
                number,
              },
            }),
          ),
        )
        .flat(),
      ...Object.values(CardColor)
        .map((color: CardColor): GameCardSpec[] =>
          actionCardKinds.map(
            (
              kind: CardKind.draw | CardKind.reverse | CardKind.skip,
            ): GameCardSpec => ({
              amount: UNO_ORIGINAL_ACTION_CARDS_PER_COLOR,
              card: {
                color,
                kind: kind,
              },
            }),
          ),
        )
        .flat(),
      ...wildCardKinds.map(
        (kind: CardKind.wild | CardKind.wildDraw4): GameCardSpec => ({
          amount: UNO_ORIGINAL_WILD_CARDS_PER_COLOR,
          card: {
            kind: kind,
          },
        }),
      ),
    ];
  }

  #getInitialCardColor(card: Card): CardColor {
    const cardAsMaybeColoredCard: Partial<ColoredCard> =
      card as Partial<ColoredCard>;

    if (cardAsMaybeColoredCard.color !== undefined) {
      return cardAsMaybeColoredCard.color;
    }

    return this.#getRandomColor();
  }

  #getInitialDirection(): GameDirection {
    return GameDirection.antiClockwise;
  }

  #getInitialDrawCount(): number {
    return 0;
  }

  #getInitialPlayingSlotIndex(): number {
    return 0;
  }

  #getRandomColor(): CardColor {
    const cardColorArray: CardColor[] = Object.values(CardColor);

    const colorCount: number = cardColorArray.length;
    const randomIndex: number = Math.floor(Math.random() * colorCount);

    return cardColorArray[randomIndex] as CardColor;
  }
}
