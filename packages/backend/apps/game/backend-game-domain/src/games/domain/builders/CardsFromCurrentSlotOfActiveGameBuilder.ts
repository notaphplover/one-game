import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { Card } from '../../../cards/domain/valueObjects/Card';
import { ActiveGame } from '../entities/ActiveGame';
import { GameService } from '../services/GameService';
import { ActiveGameSlot } from '../valueObjects/ActiveGameSlot';
import { CardsFromActiveGameSlotBuilder } from './CardsFromActiveGameSlotBuilder';

@Injectable()
export class CardsFromCurrentSlotOfActiveGameBuilder
  implements Builder<Card[], [ActiveGame, number[]]>
{
  readonly #cardsFromActiveGameSlotBuilder: Builder<
    Card[],
    [ActiveGameSlot, number[]]
  >;
  readonly #gameService: GameService;

  constructor(
    @Inject(CardsFromActiveGameSlotBuilder)
    cardsFromActiveGameSlotBuilder: Builder<Card[], [ActiveGameSlot, number[]]>,
    @Inject(GameService)
    gameService: GameService,
  ) {
    this.#cardsFromActiveGameSlotBuilder = cardsFromActiveGameSlotBuilder;
    this.#gameService = gameService;
  }

  public build(game: ActiveGame, cardIndexes: number[]): Card[] {
    return this.#cardsFromActiveGameSlotBuilder.build(
      this.#gameService.getGameSlotOrThrow(
        game,
        game.state.currentPlayingSlotIndex,
      ),
      cardIndexes,
    );
  }
}
