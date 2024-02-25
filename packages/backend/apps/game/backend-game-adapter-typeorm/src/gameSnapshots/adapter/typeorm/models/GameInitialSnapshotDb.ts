import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  RelationId,
} from 'typeorm';

import { BinaryToNumberTransformer } from '../../../../foundation/db/adapter/typeorm/transformers/BinaryToNumberTransformer';
import { GameDb } from '../../../../games/adapter/typeorm/models/GameDb';
import { GameDirectionDb } from '../../../../games/adapter/typeorm/models/GameDirectionDb';
import { GameInitialSnapshotSlotDb } from './GameInitialSnapshotSlotDb';

@Entity({
  name: 'GameInitialSnapshot',
})
export class GameInitialSnapshotDb {
  @Column({
    length: 16,
    name: 'current_card',
    nullable: false,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    transformer: new BinaryToNumberTransformer(16),
    type: 'bit',
  })
  public readonly currentCard!: number;

  @Column({
    length: 16,
    name: 'current_color',
    nullable: false,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    transformer: new BinaryToNumberTransformer(16),
    type: 'bit',
  })
  public readonly currentColor!: number;

  @Column({
    length: 32,
    name: 'current_direction',
    nullable: false,
    type: 'varchar',
  })
  public readonly currentDirection!: GameDirectionDb;

  @Column({
    name: 'current_playing_slot',
    nullable: false,
    type: 'smallint',
  })
  public readonly currentPlayingSlotIndex!: number;

  @Column({
    name: 'deck',
    nullable: false,
    type: 'json',
  })
  public readonly deck!: string;

  @Column({
    name: 'draw_count',
    nullable: false,
    type: 'smallint',
    width: 4,
  })
  public readonly drawCount!: number;

  @ManyToOne(() => GameDb, undefined, { nullable: false })
  @JoinColumn({ name: 'game_id' })
  public readonly game!: GameDb;

  @RelationId(
    (gameInitialSnapshot: GameInitialSnapshotDb) => gameInitialSnapshot.game,
  )
  public readonly gameId!: string;

  @OneToMany(
    () => GameInitialSnapshotSlotDb,
    (gameSlotDb: GameInitialSnapshotSlotDb): GameInitialSnapshotDb =>
      gameSlotDb.gameInitialSnapshot,
    {
      eager: true,
    },
  )
  public readonly gameSlotsDb!: GameInitialSnapshotSlotDb[];

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;
}
