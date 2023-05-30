import { models as apiModels } from '@cornie-js/api-models';
import {
  Card,
  CardColor,
} from '@cornie-js/backend-app-game-models/cards/domain';
import {
  ActiveGame,
  ActiveGameSlot,
  Game,
  GameCardSpec,
  GameDirection,
  NonStartedGameSlot,
} from '@cornie-js/backend-app-game-models/games/domain';
import { Builder } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { CardColorV1FromCardColorBuilder } from '../../../cards/application/builders/CardColorV1FromCardColorBuilder';
import { CardV1FromCardBuilder } from '../../../cards/application/builders/CardV1FromCardBuilder';
import { ActiveGameSlotV1FromActiveGameSlotBuilder } from './ActiveGameSlotV1FromActiveGameSlotBuilder';
import { GameDirectionV1FromGameDirectionBuilder } from './GameDirectionV1FromGameDirectionBuilder';
import { GameSpecV1FromGameCardSpecsBuilder } from './GameSpecV1FromGameCardSpecsBuilder';
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
  readonly #gameDirectionV1FromGameDirectionBuilder: Builder<
    apiModels.GameDirectionV1,
    [GameDirection]
  >;
  readonly #gameSpecV1FromGameCardSpecsBuilder: Builder<
    apiModels.GameSpecV1,
    [GameCardSpec[]]
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
    @Inject(GameDirectionV1FromGameDirectionBuilder)
    gameDirectionV1FromGameDirectionBuilder: Builder<
      apiModels.GameDirectionV1,
      [GameDirection]
    >,
    @Inject(GameSpecV1FromGameCardSpecsBuilder)
    gameSpecV1FromGameCardSpecsBuilder: Builder<
      apiModels.GameSpecV1,
      [GameCardSpec[]]
    >,
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
    this.#gameDirectionV1FromGameDirectionBuilder =
      gameDirectionV1FromGameDirectionBuilder;
    this.#gameSpecV1FromGameCardSpecsBuilder =
      gameSpecV1FromGameCardSpecsBuilder;
    this.#nonStartedGameSlotV1FromNonStartedGameSlotBuilder =
      nonStartedGameSlotV1FromNonStartedGameSlotBuilder;
  }

  public build(game: Game): apiModels.GameV1 {
    let gameV1: apiModels.GameV1;

    if (this.#isActiveGame(game)) {
      const activeGameV1: apiModels.ActiveGameV1 = {
        currentCard: this.#cardV1FromCardBuilder.build(game.state.currentCard),
        currentColor: this.#cardColorV1FromCardColorBuilder.build(
          game.state.currentColor,
        ),
        currentDirection: this.#gameDirectionV1FromGameDirectionBuilder.build(
          game.state.currentDirection,
        ),
        currentPlayingSlotIndex: game.state.currentPlayingSlotIndex,
        drawCount: game.state.drawCount,
        gameSlotsAmount: game.gameSlotsAmount,
        gameSpec: this.#gameSpecV1FromGameCardSpecsBuilder.build(
          game.spec.cards,
        ),
        id: game.id,
        slots: game.state.slots.map((gameSlot: ActiveGameSlot) =>
          this.#activeGameSlotV1FromActiveGameSlotBuilder.build(gameSlot),
        ),
      };

      gameV1 = activeGameV1;
    } else {
      const nonStartedGameV1: apiModels.NonStartedGameV1 = {
        gameSlotsAmount: game.gameSlotsAmount,
        gameSpec: this.#gameSpecV1FromGameCardSpecsBuilder.build(
          game.spec.cards,
        ),
        id: game.id,
        slots: game.state.slots.map((gameSlot: NonStartedGameSlot) =>
          this.#nonStartedGameSlotV1FromNonStartedGameSlotBuilder.build(
            gameSlot,
          ),
        ),
      };

      gameV1 = nonStartedGameV1;
    }

    return gameV1;
  }

  #isActiveGame(game: Game): game is ActiveGame {
    return game.state.active;
  }
}
