import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { ActiveGame } from '../entities/ActiveGame';
import { GameUpdateQuery } from '../query/GameUpdateQuery';
import { IsGameFinishedSpec } from '../specs/IsGameFinishedSpec';
import { GameDirection } from '../valueObjects/GameDirection';
import { GameSpec } from '../valueObjects/GameSpec';
import { GameStatus } from '../valueObjects/GameStatus';

@Injectable()
export class GamePassTurnUpdateQueryFromGameBuilder
  implements Builder<GameUpdateQuery, [ActiveGame, GameSpec]>
{
  readonly #isGameFinishedSpec: IsGameFinishedSpec;

  constructor(
    @Inject(IsGameFinishedSpec)
    isGameFinishedSpec: IsGameFinishedSpec,
  ) {
    this.#isGameFinishedSpec = isGameFinishedSpec;
  }

  public build(game: ActiveGame, gameSpec: GameSpec): GameUpdateQuery {
    const gameUpdateQuery: GameUpdateQuery = {
      currentPlayingSlotIndex: this.#getNextTurnPlayerIndex(game, gameSpec),
      currentTurnCardsDrawn: false,
      currentTurnCardsPlayed: false,
      currentTurnSingleCardDraw: null,
      gameFindQuery: {
        id: game.id,
        state: {
          currentPlayingSlotIndex: game.state.currentPlayingSlotIndex,
        },
      },
      skipCount: 0,
      turn: game.state.turn + 1,
    };

    if (this.#isGameFinishedSpec.isSatisfiedBy(game)) {
      gameUpdateQuery.status = GameStatus.finished;
    }

    return gameUpdateQuery;
  }

  #getNextTurnPlayerIndex(game: ActiveGame, gameSpec: GameSpec): number {
    const players: number = gameSpec.gameSlotsAmount;
    const modulus: number = players + 1;
    const direction: GameDirection = game.state.currentDirection;

    let nextTurnPlayerIndex: number;

    if (direction === GameDirection.antiClockwise) {
      nextTurnPlayerIndex =
        game.state.currentPlayingSlotIndex - (1 + game.state.skipCount);

      if (nextTurnPlayerIndex < 0) {
        nextTurnPlayerIndex = (nextTurnPlayerIndex % modulus) + modulus;
      }
    } else {
      nextTurnPlayerIndex =
        (game.state.currentPlayingSlotIndex + (1 + game.state.skipCount)) %
        modulus;
    }

    return nextTurnPlayerIndex;
  }
}
