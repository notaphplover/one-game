import { Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameCardSpec } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardDbBuilder';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameCardSpecDb } from '../models/GameCardSpecDb';

@Injectable()
export class GameCardSpecArrayDbFromGameCardSpecArrayBuilder
  implements Builder<string, [GameCardSpec[]]>
{
  readonly #cardDbBuilder: Builder<CardDb, [Card]>;

  constructor(
    @Inject(CardDbBuilder)
    cardDbBuilder: Builder<CardDb, [Card]>,
  ) {
    this.#cardDbBuilder = cardDbBuilder;
  }

  public build(gameCardSpecArray: GameCardSpec[]): string {
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
