import { Inject, Injectable } from '@nestjs/common';
import { models as apiModels } from '@one-game-js/api-models';
import { Builder } from '@one-game-js/backend-common';

import { CardFromCardV1Builder } from '../../../cards/application/builders/CardFromCardV1Builder';
import { Card } from '../../../cards/domain/models/Card';
import { GameCardSpec } from '../../domain/models/GameCardSpec';

@Injectable()
export class GameCardSpecFromGameCardSpecV1Builder
  implements Builder<GameCardSpec, [apiModels.GameCardSpecV1]>
{
  readonly #cardV1ToCardBuilder: Builder<Card, [apiModels.CardV1]>;

  constructor(
    @Inject(CardFromCardV1Builder)
    cardV1ToCardBuilder: Builder<Card, [apiModels.CardV1]>,
  ) {
    this.#cardV1ToCardBuilder = cardV1ToCardBuilder;
  }

  public build(gameCardSpecV1: apiModels.GameCardSpecV1): GameCardSpec {
    return {
      amount: gameCardSpecV1.amount,
      card: this.#cardV1ToCardBuilder.build(gameCardSpecV1.card),
    };
  }
}
