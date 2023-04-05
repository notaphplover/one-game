import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { CardColorV1FromCardColorBuilder } from '../../../cards/application/builders/CardColorV1FromCardColorBuilder';
import { CardV1FromCardBuilder } from '../../../cards/application/builders/CardV1FromCardBuilder';
import { Card } from '../../../cards/domain/models/Card';
import { CardColor } from '../../../cards/domain/models/CardColor';
import { Game } from '../../domain/models/Game';
import { GameCardSpec } from '../../domain/models/GameCardSpec';
import { GameDirection } from '../../domain/models/GameDirection';
import { GameDirectionV1FromGameDirectionBuilder } from './GameDirectionV1FromGameDirectionBuilder';
import { GameSpecV1FromGameCardSpecsBuilder } from './GameSpecV1FromGameCardSpecsBuilder';

@Injectable()
export class GameV1FromGameBuilder
  implements Builder<apiModels.GameV1, [Game]>
{
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

  constructor(
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
  ) {
    this.#cardColorV1FromCardColorBuilder = cardColorV1FromCardColorBuilder;
    this.#cardV1FromCardBuilder = cardV1FromCardBuilder;
    this.#gameDirectionV1FromGameDirectionBuilder =
      gameDirectionV1FromGameDirectionBuilder;
    this.#gameSpecV1FromGameCardSpecsBuilder =
      gameSpecV1FromGameCardSpecsBuilder;
  }

  public build(game: Game): apiModels.GameV1 {
    let gameV1: apiModels.GameV1;

    if (game.active) {
      gameV1 = {
        currentCard: this.#cardV1FromCardBuilder.build(game.currentCard),
        currentColor: this.#cardColorV1FromCardColorBuilder.build(
          game.currentColor,
        ),
        currentDirection: this.#gameDirectionV1FromGameDirectionBuilder.build(
          game.currentDirection,
        ),
        currentPlayingSlotIndex: game.currentPlayingSlotIndex,
        gameSlotsAmount: game.slots.length,
        gameSpec: this.#gameSpecV1FromGameCardSpecsBuilder.build(game.spec),
        id: game.id,
      };
    } else {
      gameV1 = {
        gameSlotsAmount: game.slots.length,
        gameSpec: this.#gameSpecV1FromGameCardSpecsBuilder.build(game.spec),
        id: game.id,
      };
    }

    return gameV1;
  }
}
