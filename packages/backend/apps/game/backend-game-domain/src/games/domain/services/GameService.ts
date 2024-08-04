import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { CardColor } from '../../../cards/domain/valueObjects/CardColor';
import { CardKind } from '../../../cards/domain/valueObjects/CardKind';
import { ColoredCard } from '../../../cards/domain/valueObjects/ColoredCard';
import { ActiveGame } from '../entities/ActiveGame';
import { Game } from '../entities/Game';
import { NonStartedGame } from '../entities/NonStartedGame';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { GameCardSpec } from '../valueObjects/GameCardSpec';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameSpec } from '../valueObjects/GameSpec';
import { NonStartedGameSlot } from '../valueObjects/NonStartedGameSlot';

const UNO_ORIGINAL_ACTION_CARDS_PER_COLOR: number = 2;
const UNO_ORIGINAL_NUMBERS_AMOUNT: number = 10;
const UNO_ORIGINAL_NUMBERED_NON_ZERO_CARDS_PER_COLOR: number = 2;
const UNO_ORIGINAL_NUMBERED_ZERO_CARDS_PER_COLOR: number = 1;
const UNO_ORIGINAL_WILD_CARDS_PER_COLOR: number = 4;

@Injectable()
export class GameService {
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
        `Expecting a game slot at index "${index.toString()}", none found instead.`,
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

  public getInitialCardColor(card: Card): CardColor {
    const cardAsMaybeColoredCard: Partial<ColoredCard> =
      card as Partial<ColoredCard>;

    if (cardAsMaybeColoredCard.color !== undefined) {
      return cardAsMaybeColoredCard.color;
    }

    return this.#getRandomColor();
  }

  public getInitialDirection(): GameDirection {
    return GameDirection.clockwise;
  }

  public getInitialPlayingSlotIndex(gameSpec: GameSpec): number {
    return gameSpec.gameSlotsAmount - 1;
  }

  public getInitialTurn(): number {
    return 0;
  }

  public isColored(card: Card): card is Card & ColoredCard {
    return (card as Partial<ColoredCard>).color !== undefined;
  }

  #getRandomColor(): CardColor {
    const cardColorArray: CardColor[] = Object.values(CardColor);

    const colorCount: number = cardColorArray.length;
    const randomIndex: number = Math.floor(Math.random() * colorCount);

    return cardColorArray[randomIndex] as CardColor;
  }
}
