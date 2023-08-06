import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  ActiveGame,
  ActiveGameSlot,
  FinishedGame,
  FinishedGameSlot,
  Game,
  GameDirection,
  GameSpec,
  GameStatus,
  NonStartedGame,
  NonStartedGameSlot,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardColorV1FromCardColorBuilder } from '../../../cards/application/builders/CardColorV1FromCardColorBuilder';
import { CardV1FromCardBuilder } from '../../../cards/application/builders/CardV1FromCardBuilder';
import { ActiveGameSlotV1FromActiveGameSlotBuilder } from './ActiveGameSlotV1FromActiveGameSlotBuilder';
import { FinishedGameSlotV1FromFinishedGameSlotBuilder } from './FinishedGameSlotV1FromFinishedGameSlotBuilder';
import { GameDirectionV1FromGameDirectionBuilder } from './GameDirectionV1FromGameDirectionBuilder';
import { GameSpecV1FromGameSpecBuilder } from './GameSpecV1FromGameSpecBuilder';
import { NonStartedGameSlotV1FromNonStartedGameSlotBuilder } from './NonStartedGameSlotV1FromNonStartedGameSlotBuilder';

@Injectable()
export class GameV1FromGameBuilder
  implements Builder<apiModels.GameV1, [Game]>
{
  readonly #activeGameSlotV1FromActiveGameSlotBuilder: Builder<
    apiModels.ActiveGameSlotV1,
    [ActiveGameSlot]
  >;
  readonly #cardColorV1FromCardColorBuilder: Builder<
    apiModels.CardColorV1,
    [CardColor]
  >;
  readonly #cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>;
  readonly #finishedGameSlotV1FromFinishedGameSlotBuilder: Builder<
    apiModels.FinishedGameSlotV1,
    [FinishedGameSlot]
  >;
  readonly #gameDirectionV1FromGameDirectionBuilder: Builder<
    apiModels.GameDirectionV1,
    [GameDirection]
  >;
  readonly #gameSpecV1FromGameSpecBuilder: Builder<
    apiModels.GameSpecV1,
    [GameSpec]
  >;

  readonly #nonStartedGameSlotV1FromNonStartedGameSlotBuilder: Builder<
    apiModels.NonStartedGameSlotV1,
    [NonStartedGameSlot]
  >;

  constructor(
    @Inject(ActiveGameSlotV1FromActiveGameSlotBuilder)
    activeGameSlotV1FromActiveGameSlotBuilder: Builder<
      apiModels.ActiveGameSlotV1,
      [ActiveGameSlot]
    >,
    @Inject(CardColorV1FromCardColorBuilder)
    cardColorV1FromCardColorBuilder: Builder<
      apiModels.CardColorV1,
      [CardColor]
    >,
    @Inject(CardV1FromCardBuilder)
    cardV1FromCardBuilder: Builder<apiModels.CardV1, [Card]>,
    @Inject(FinishedGameSlotV1FromFinishedGameSlotBuilder)
    finishedGameSlotV1FromFinishedGameSlotBuilder: Builder<
      apiModels.FinishedGameSlotV1,
      [FinishedGameSlot]
    >,
    @Inject(GameDirectionV1FromGameDirectionBuilder)
    gameDirectionV1FromGameDirectionBuilder: Builder<
      apiModels.GameDirectionV1,
      [GameDirection]
    >,
    @Inject(GameSpecV1FromGameSpecBuilder)
    gameSpecV1FromGameSpecBuilder: Builder<apiModels.GameSpecV1, [GameSpec]>,
    @Inject(NonStartedGameSlotV1FromNonStartedGameSlotBuilder)
    nonStartedGameSlotV1FromNonStartedGameSlotBuilder: Builder<
      apiModels.NonStartedGameSlotV1,
      [NonStartedGameSlot]
    >,
  ) {
    this.#activeGameSlotV1FromActiveGameSlotBuilder =
      activeGameSlotV1FromActiveGameSlotBuilder;
    this.#cardColorV1FromCardColorBuilder = cardColorV1FromCardColorBuilder;
    this.#cardV1FromCardBuilder = cardV1FromCardBuilder;
    this.#finishedGameSlotV1FromFinishedGameSlotBuilder =
      finishedGameSlotV1FromFinishedGameSlotBuilder;
    this.#gameDirectionV1FromGameDirectionBuilder =
      gameDirectionV1FromGameDirectionBuilder;
    this.#gameSpecV1FromGameSpecBuilder = gameSpecV1FromGameSpecBuilder;
    this.#nonStartedGameSlotV1FromNonStartedGameSlotBuilder =
      nonStartedGameSlotV1FromNonStartedGameSlotBuilder;
  }

  public build(game: Game): apiModels.GameV1 {
    if (this.#isActiveGame(game)) {
      return this.#buildActiveGameV1(game);
    }

    if (this.#isFinishedGame(game)) {
      return this.#buildFinishedGameV1(game);
    }

    if (this.#isNonStartedGame(game)) {
      return this.#buildNonStartedGameV1(game);
    }

    throw new AppError(AppErrorKind.unknown, 'Unable to parse game');
  }

  #buildActiveGameV1(game: ActiveGame): apiModels.ActiveGameV1 {
    return {
      id: game.id,
      spec: this.#gameSpecV1FromGameSpecBuilder.build(game.spec),
      state: {
        currentCard: this.#cardV1FromCardBuilder.build(game.state.currentCard),
        currentColor: this.#cardColorV1FromCardColorBuilder.build(
          game.state.currentColor,
        ),
        currentDirection: this.#gameDirectionV1FromGameDirectionBuilder.build(
          game.state.currentDirection,
        ),
        currentPlayingSlotIndex: game.state.currentPlayingSlotIndex,
        currentTurnCardsPlayed: game.state.currentTurnCardsPlayed,
        drawCount: game.state.drawCount,
        slots: game.state.slots.map((gameSlot: ActiveGameSlot) =>
          this.#activeGameSlotV1FromActiveGameSlotBuilder.build(gameSlot),
        ),
        status: 'active',
      },
    };
  }

  #buildFinishedGameV1(game: FinishedGame): apiModels.FinishedGameV1 {
    return {
      id: game.id,
      spec: this.#gameSpecV1FromGameSpecBuilder.build(game.spec),
      state: {
        slots: game.state.slots.map((gameSlot: FinishedGameSlot) =>
          this.#finishedGameSlotV1FromFinishedGameSlotBuilder.build(gameSlot),
        ),
        status: 'finished',
      },
    };
  }

  #buildNonStartedGameV1(game: NonStartedGame): apiModels.NonStartedGameV1 {
    return {
      id: game.id,
      spec: this.#gameSpecV1FromGameSpecBuilder.build(game.spec),
      state: {
        slots: game.state.slots.map((gameSlot: NonStartedGameSlot) =>
          this.#nonStartedGameSlotV1FromNonStartedGameSlotBuilder.build(
            gameSlot,
          ),
        ),
        status: 'nonStarted',
      },
    };
  }

  #isActiveGame(game: Game): game is ActiveGame {
    return game.state.status === GameStatus.active;
  }

  #isFinishedGame(game: Game): game is FinishedGame {
    return game.state.status === GameStatus.finished;
  }

  #isNonStartedGame(game: Game): game is NonStartedGame {
    return game.state.status === GameStatus.nonStarted;
  }
}
