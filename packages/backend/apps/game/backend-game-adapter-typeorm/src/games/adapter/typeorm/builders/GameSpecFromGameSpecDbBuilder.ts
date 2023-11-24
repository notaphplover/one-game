import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { Card } from '@cornie-js/backend-game-domain/cards';
import { GameCardSpec, GameSpec } from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';

import { CardBuilder } from '../../../../cards/adapter/typeorm/builders/CardBuilder';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameCardSpecDb } from '../models/GameCardSpecDb';
import { GameSpecDb } from '../models/GameSpecDb';

@Injectable()
export class GameSpecFromGameSpecDbBuilder
  implements Builder<GameSpec, [GameSpecDb]>
{
  readonly #cardBuilder: Builder<Card, [CardDb]>;

  constructor(@Inject(CardBuilder) cardBuilder: Builder<Card, [CardDb]>) {
    this.#cardBuilder = cardBuilder;
  }

  public build(gameSpecDb: GameSpecDb): GameSpec {
    return {
      cards: this.#convertCardSpecs(gameSpecDb.cardsSpec),
      gameSlotsAmount: gameSpecDb.gameSlotsAmount,
    };
  }

  #convertCardSpecs(specs: string): GameCardSpec[] {
    const gameCardDbSpecs: unknown = JSON.parse(specs);

    if (!this.#isGameCardSpecDbArray(gameCardDbSpecs)) {
      throw new AppError(AppErrorKind.unknown, 'Unexpected card spec db entry');
    }

    return gameCardDbSpecs.map((gameCardSpecDb: GameCardSpecDb) => ({
      amount: gameCardSpecDb.amount,
      card: this.#cardBuilder.build(gameCardSpecDb.card),
    }));
  }

  #isGameCardSpecDbArray(
    parsedSpecs: unknown,
  ): parsedSpecs is GameCardSpecDb[] {
    return (
      Array.isArray(parsedSpecs) &&
      parsedSpecs.every((parsedSpec: unknown): parsedSpec is GameCardSpecDb =>
        this.#isGameCardSpecDb(parsedSpec),
      )
    );
  }

  #isGameCardSpecDb(parsedSpec: unknown): parsedSpec is GameCardSpecDb {
    return (
      typeof parsedSpec === 'object' &&
      parsedSpec !== null &&
      typeof (parsedSpec as GameCardSpecDb).amount === 'number' &&
      typeof (parsedSpec as GameCardSpecDb).card === 'number'
    );
  }
}
