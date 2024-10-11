import { Builder, Writable } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  GameCardSpec,
  GameDirection,
  GameStatus,
  GameUpdateQuery,
} from '@cornie-js/backend-game-domain/games';
import { Inject, Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardColorDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardColorDbBuilder';
import { CardDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardDbBuilder';
import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDb } from '../models/GameDb';
import { GameDirectionDb } from '../models/GameDirectionDb';
import { GameStatusDb } from '../models/GameStatusDb';
import { GameCardSpecArrayDbFromGameCardSpecArrayBuilder } from './GameCardSpecArrayDbFromGameCardSpecArrayBuilder';
import { GameDirectionDbFromGameDirectionBuilder } from './GameDirectionDbFromGameDirectionBuilder';
import { GameStatusDbFromGameStatusBuilder } from './GameStatusDbFromGameStatusBuilder';

@Injectable()
export class GameSetQueryTypeOrmFromGameUpdateQueryBuilder
  implements Builder<QueryDeepPartialEntity<GameDb>, [GameUpdateQuery]>
{
  readonly #cardColorDbBuilder: Builder<CardColorDb, [CardColor]>;
  readonly #cardDbBuilder: Builder<CardDb, [Card]>;
  readonly #gameCardSpecArrayDbFromGameCardSpecArrayBuilder: Builder<
    string,
    [GameCardSpec[]]
  >;
  readonly #gameDirectionDbFromGameDirectionBuilder: Builder<
    GameDirectionDb,
    [GameDirection]
  >;
  readonly #gameStatusDbFromGameStatusBuilder: Builder<
    GameStatusDb,
    [GameStatus]
  >;

  constructor(
    @Inject(CardColorDbBuilder)
    cardColorDbBuilder: Builder<CardColorDb, [CardColor]>,
    @Inject(CardDbBuilder)
    cardDbBuilder: Builder<CardDb, [Card]>,
    @Inject(GameCardSpecArrayDbFromGameCardSpecArrayBuilder)
    gameCardSpecArrayDbFromGameCardSpecArrayBuilder: Builder<
      string,
      [GameCardSpec[]]
    >,
    @Inject(GameDirectionDbFromGameDirectionBuilder)
    gameDirectionDbFromGameDirectionBuilder: Builder<
      GameDirectionDb,
      [GameDirection]
    >,
    @Inject(GameStatusDbFromGameStatusBuilder)
    gameStatusDbFromGameStatusBuilder: Builder<GameStatusDb, [GameStatus]>,
  ) {
    this.#cardColorDbBuilder = cardColorDbBuilder;
    this.#cardDbBuilder = cardDbBuilder;
    this.#gameCardSpecArrayDbFromGameCardSpecArrayBuilder =
      gameCardSpecArrayDbFromGameCardSpecArrayBuilder;
    this.#gameDirectionDbFromGameDirectionBuilder =
      gameDirectionDbFromGameDirectionBuilder;
    this.#gameStatusDbFromGameStatusBuilder = gameStatusDbFromGameStatusBuilder;
  }

  public build(
    gameUpdateQuery: GameUpdateQuery,
  ): QueryDeepPartialEntity<GameDb> {
    const gameSetQueryTypeOrm: Writable<QueryDeepPartialEntity<GameDb>> = {};

    if (gameUpdateQuery.status !== undefined) {
      gameSetQueryTypeOrm.status =
        this.#gameStatusDbFromGameStatusBuilder.build(gameUpdateQuery.status);
    }

    if (gameUpdateQuery.currentCard !== undefined) {
      gameSetQueryTypeOrm.currentCard = this.#cardDbBuilder.build(
        gameUpdateQuery.currentCard,
      );
    }

    if (gameUpdateQuery.currentColor !== undefined) {
      gameSetQueryTypeOrm.currentColor = this.#cardColorDbBuilder.build(
        gameUpdateQuery.currentColor,
      );
      this.#cardColorDbBuilder.build(gameUpdateQuery.currentColor);
    }

    if (gameUpdateQuery.currentDirection !== undefined) {
      gameSetQueryTypeOrm.currentDirection =
        this.#gameDirectionDbFromGameDirectionBuilder.build(
          gameUpdateQuery.currentDirection,
        );
    }

    if (gameUpdateQuery.currentPlayingSlotIndex !== undefined) {
      gameSetQueryTypeOrm.currentPlayingSlotIndex =
        gameUpdateQuery.currentPlayingSlotIndex;
    }

    if (gameUpdateQuery.currentTurnCardsDrawn !== undefined) {
      gameSetQueryTypeOrm.currentTurnCardsDrawn =
        gameUpdateQuery.currentTurnCardsDrawn;
    }

    if (gameUpdateQuery.currentTurnSingleCardDraw !== undefined) {
      gameSetQueryTypeOrm.currentTurnSingleCardDraw =
        gameUpdateQuery.currentTurnSingleCardDraw === null
          ? null
          : this.#cardDbBuilder.build(
              gameUpdateQuery.currentTurnSingleCardDraw,
            );
    }

    if (gameUpdateQuery.currentTurnCardsPlayed !== undefined) {
      gameSetQueryTypeOrm.currentTurnCardsPlayed =
        gameUpdateQuery.currentTurnCardsPlayed;
    }

    if (gameUpdateQuery.deck !== undefined) {
      gameSetQueryTypeOrm.deck =
        this.#gameCardSpecArrayDbFromGameCardSpecArrayBuilder.build(
          gameUpdateQuery.deck,
        );
    }

    if (gameUpdateQuery.discardPile !== undefined) {
      gameSetQueryTypeOrm.discardPile =
        this.#gameCardSpecArrayDbFromGameCardSpecArrayBuilder.build(
          gameUpdateQuery.discardPile,
        );
    }

    if (gameUpdateQuery.drawCount !== undefined) {
      gameSetQueryTypeOrm.drawCount = gameUpdateQuery.drawCount;
    }

    if (gameUpdateQuery.lastGameActionId !== undefined) {
      if (gameUpdateQuery.lastGameActionId === null) {
        gameSetQueryTypeOrm.lastGameAction = null;
      } else {
        gameSetQueryTypeOrm.lastGameAction = {
          id: gameUpdateQuery.lastGameActionId,
        };
      }
    }

    if (gameUpdateQuery.turn !== undefined) {
      gameSetQueryTypeOrm.turn = gameUpdateQuery.turn;
    }

    if (gameUpdateQuery.turnExpiresAt !== undefined) {
      gameSetQueryTypeOrm.turnExpiresAt = gameUpdateQuery.turnExpiresAt;
    }

    if (gameUpdateQuery.skipCount !== undefined) {
      gameSetQueryTypeOrm.skipCount = gameUpdateQuery.skipCount;
    }

    return gameSetQueryTypeOrm;
  }
}
