import { Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  GameCardSpec,
  GameDirection,
} from '@cornie-js/backend-game-domain/games';
import { GameInitialSnapshotCreateQuery } from '@cornie-js/backend-game-domain/gameSnapshots';
import { Inject, Injectable } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardColorDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardColorDbBuilder';
import { CardDbBuilder } from '../../../../cards/adapter/typeorm/builders/CardDbBuilder';
import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameCardSpecArrayDbFromGameCardSpecArrayBuilder } from '../../../../games/adapter/typeorm/builders/GameCardSpecArrayDbFromGameCardSpecArrayBuilder';
import { GameDirectionDbFromGameDirectionBuilder } from '../../../../games/adapter/typeorm/builders/GameDirectionDbFromGameDirectionBuilder';
import { GameDirectionDb } from '../../../../games/adapter/typeorm/models/GameDirectionDb';
import { GameInitialSnapshotDb } from '../models/GameInitialSnapshotDb';

@Injectable()
export class GameInitialSnapshotCreateQueryTypeOrmFromGameInitialSnapshotCreateQueryBuilder
  implements
    Builder<
      QueryDeepPartialEntity<GameInitialSnapshotDb>,
      [GameInitialSnapshotCreateQuery]
    >
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
  ) {
    this.#cardColorDbBuilder = cardColorDbBuilder;
    this.#cardDbBuilder = cardDbBuilder;
    this.#gameCardSpecArrayDbFromGameCardSpecArrayBuilder =
      gameCardSpecArrayDbFromGameCardSpecArrayBuilder;
    this.#gameDirectionDbFromGameDirectionBuilder =
      gameDirectionDbFromGameDirectionBuilder;
  }

  public build(
    gameInitialSnapshotCreateQuery: GameInitialSnapshotCreateQuery,
  ): QueryDeepPartialEntity<GameInitialSnapshotDb> {
    return {
      currentCard: this.#cardDbBuilder.build(
        gameInitialSnapshotCreateQuery.currentCard,
      ),
      currentColor: this.#cardColorDbBuilder.build(
        gameInitialSnapshotCreateQuery.currentColor,
      ),
      currentDirection: this.#gameDirectionDbFromGameDirectionBuilder.build(
        gameInitialSnapshotCreateQuery.currentDirection,
      ),
      currentPlayingSlotIndex:
        gameInitialSnapshotCreateQuery.currentPlayingSlotIndex,
      deck: this.#gameCardSpecArrayDbFromGameCardSpecArrayBuilder.build(
        gameInitialSnapshotCreateQuery.deck,
      ),
      drawCount: gameInitialSnapshotCreateQuery.drawCount,
      game: {
        id: gameInitialSnapshotCreateQuery.gameId,
      },
      id: gameInitialSnapshotCreateQuery.id,
    };
  }
}
