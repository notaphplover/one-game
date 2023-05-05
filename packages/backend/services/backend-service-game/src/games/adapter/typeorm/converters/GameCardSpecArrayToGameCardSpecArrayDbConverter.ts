import { Builder, Converter } from '@cornie-js/backend-common';
import { Inject, Injectable } from '@nestjs/common';

import { CardDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardDbBuilder';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { Card } from '../../../../cards/domain/models/Card';
import { GameCardSpec } from '../../../domain/models/GameCardSpec';
import { GameCardSpecDb } from '../models/GameCardSpecDb';

@Injectable()
export class GameCardSpecArrayToGameCardSpecArrayDbConverter
  implements Converter<GameCardSpec[], string>
{
  readonly #cardDbBuilder: Builder<CardDb, [Card]>;

  constructor(
    @Inject(CardDbBuilder)
    cardDbBuilder: Builder<CardDb, [Card]>,
  ) {
    this.#cardDbBuilder = cardDbBuilder;
  }

  public convert(gameCardSpecArray: GameCardSpec[]): string {
    return JSON.stringify(this.#buildCardSpecsDb(gameCardSpecArray));
  }

  #buildCardSpecDb(cardSpec: GameCardSpec): GameCardSpecDb {
    return {
      amount: cardSpec.amount,
      card: this.#cardDbBuilder.build(cardSpec.card),
    };
  }

  #buildCardSpecsDb(cardSpecs: GameCardSpec[]): GameCardSpecDb[] {
    return cardSpecs.map(
      (cardSpec: GameCardSpec): GameCardSpecDb =>
        this.#buildCardSpecDb(cardSpec),
    );
  }
}
