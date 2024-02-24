import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';

import { GameInitialSnapshotDb } from './GameInitialSnapshotDb';

@Entity({
  name: 'GameInitialSnapshotSlot',
})
export class GameInitialSnapshotSlotDb {
  @Column({
    name: 'cards',
    nullable: false,
    type: 'json',
  })
  public readonly cards!: string;

  @ManyToOne(
    () => GameInitialSnapshotDb,
    (
      gameInitialSnapshotDb: GameInitialSnapshotDb,
    ): GameInitialSnapshotSlotDb[] => gameInitialSnapshotDb.gameSlotsDb,
    { nullable: false },
  )
  @JoinColumn({ name: 'game_initial_snapshot_id' })
  public readonly gameInitialSnapshot!: GameInitialSnapshotDb;

  @RelationId(
    (gameSlot: GameInitialSnapshotSlotDb) => gameSlot.gameInitialSnapshot,
  )
  public readonly gameInitialSnapshotId!: string;

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;

  @Column({
    name: 'position',
    nullable: true,
    type: 'smallint',
  })
  public readonly position!: number;

  @Column({
    length: 36,
    name: 'user_id',
    type: 'varchar',
  })
  public readonly userId!: string;
}
