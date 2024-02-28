import { Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  GameCardSpec,
  GameDirection,
} from '@cornie-js/backend-game-domain/games';
import {
  GameInitialSnapshot,
  GameInitialSnapshotSlot,
} from '@cornie-js/backend-game-domain/gameSnapshots';
import { Inject, Injectable } from '@nestjs/common';

import { CardBuilder } from '../../../../cards/adapter/typeorm/builders/CardBuilder';
import { CardColorBuilder } from '../../../../cards/adapter/typeorm/builders/CardColorBuilder';
import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameCardSpecArrayFromGameCardSpecArrayDbBuilder } from '../../../../games/adapter/typeorm/builders/GameCardSpecArrayFromGameCardSpecArrayDbBuilder';
import { GameDirectionFromGameDirectionDbBuilder } from '../../../../games/adapter/typeorm/builders/GameDirectionFromGameDirectionDbBuilder';
import { GameDirectionDb } from '../../../../games/adapter/typeorm/models/GameDirectionDb';
import { GameInitialSnapshotDb } from '../models/GameInitialSnapshotDb';
import { GameInitialSnapshotSlotDb } from '../models/GameInitialSnapshotSlotDb';
import { GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder } from './GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder';

@Injectable()
export class GameInitialSnapshotFromGameInitialSnapshotDbBuilder
  implements Builder<GameInitialSnapshot, [GameInitialSnapshotDb]>
{
  readonly #cardBuilder: Builder<Card, [CardDb]>;
  readonly #cardColorBuilder: Builder<CardColor, [CardColorDb]>;
  readonly #gameCardSpecArrayFromGameCardSpecArrayDbBuilder: Builder<
    GameCardSpec[],
    [string]
  >;
  readonly #gameDirectionFromGameDirectionDbBuilder: Builder<
    GameDirection,
    [GameDirectionDb]
  >;
  readonly #gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder: Builder<
    GameInitialSnapshotSlot,
    [GameInitialSnapshotSlotDb]
  >;

  constructor(
    @Inject(CardBuilder)
    cardBuilder: Builder<Card, [CardDb]>,
    @Inject(CardColorBuilder)
    cardColorBuilder: Builder<CardColor, [CardColorDb]>,
    @Inject(GameCardSpecArrayFromGameCardSpecArrayDbBuilder)
    gameCardSpecArrayFromGameCardSpecArrayDbBuilder: Builder<
      GameCardSpec[],
      [string]
    >,
    @Inject(GameDirectionFromGameDirectionDbBuilder)
    gameDirectionFromGameDirectionDbBuilder: Builder<
      GameDirection,
      [GameDirectionDb]
    >,
    @Inject(GameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder)
    gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder: Builder<
      GameInitialSnapshotSlot,
      [GameInitialSnapshotSlotDb]
    >,
  ) {
    this.#cardBuilder = cardBuilder;
    this.#cardColorBuilder = cardColorBuilder;
    this.#gameCardSpecArrayFromGameCardSpecArrayDbBuilder =
      gameCardSpecArrayFromGameCardSpecArrayDbBuilder;
    this.#gameDirectionFromGameDirectionDbBuilder =
      gameDirectionFromGameDirectionDbBuilder;
    this.#gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder =
      gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder;
  }

  public build(
    gameInitialSnapshotDb: GameInitialSnapshotDb,
  ): GameInitialSnapshot {
    return {
      currentCard: this.#cardBuilder.build(gameInitialSnapshotDb.currentCard),
      currentColor: this.#cardColorBuilder.build(
        gameInitialSnapshotDb.currentColor,
      ),
      currentDirection: this.#gameDirectionFromGameDirectionDbBuilder.build(
        gameInitialSnapshotDb.currentDirection,
      ),
      currentPlayingSlotIndex: gameInitialSnapshotDb.currentPlayingSlotIndex,
      deck: this.#gameCardSpecArrayFromGameCardSpecArrayDbBuilder.build(
        gameInitialSnapshotDb.deck,
      ),
      drawCount: gameInitialSnapshotDb.drawCount,
      id: gameInitialSnapshotDb.id,
      slots: gameInitialSnapshotDb.gameSlotsDb.map(
        (gameSlotDb: GameInitialSnapshotSlotDb) =>
          this.#gameInitialSnapshotSlotFromGameInitialSnapshotSlotDbBuilder.build(
            gameSlotDb,
          ),
      ),
    };
  }
}
