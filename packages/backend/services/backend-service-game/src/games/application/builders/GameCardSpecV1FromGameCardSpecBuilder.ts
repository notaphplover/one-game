import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { CardV1FromCardBuilder } from '../../../cards/application/builders/CardV1FromCardBuilder';
import { Card } from '../../../cards/domain/models/Card';
import { GameCardSpec } from '../../domain/models/GameCardSpec';

@Injectable()
export class GameCardSpecV1FromGameCardSpecBuilder
  implements Builder<apiModels.GameCardSpecV1, [GameCardSpec]>
{
  readonly #cardToCardV1Builder: Builder<apiModels.CardV1, [Card]>;

  constructor(
    @Inject(CardV1FromCardBuilder)
    cardV1ToCardBuilder: Builder<apiModels.CardV1, [Card]>,
  ) {
    this.#cardToCardV1Builder = cardV1ToCardBuilder;
  }

  public build(gameCardSpec: GameCardSpec): apiModels.GameCardSpecV1 {
    return {
      amount: gameCardSpec.amount,
      card: this.#cardToCardV1Builder.build(gameCardSpec.card),
    };
  }
}
