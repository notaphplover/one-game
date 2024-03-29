import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameCardSpec } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardV1FromCardBuilder } from '../../../cards/application/builders/CardV1FromCardBuilder';

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
