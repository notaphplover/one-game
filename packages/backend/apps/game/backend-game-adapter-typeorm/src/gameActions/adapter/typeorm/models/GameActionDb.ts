import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';

import { GameDb } from '../../../../games/adapter/typeorm/models/GameDb';

@Entity({
  name: 'GameAction',
})
@Index(['game', 'position'], { unique: true })
@Index(['game', 'turn'])
export class GameActionDb {
  @Column({
    name: 'current_playing_slot',
    type: 'smallint',
  })
  public readonly currentPlayingSlotIndex!: number;

  @ManyToOne(() => GameDb, undefined, { nullable: false })
  @JoinColumn({ name: 'game_id' })
  public readonly game!: GameDb;

  @RelationId((gameAction: GameActionDb) => gameAction.game)
  public readonly gameId!: string;

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;

  @Column({
    name: 'payload',
    nullable: false,
    type: 'json',
  })
  public readonly payload!: string;

  @Column({
    name: 'position',
    nullable: false,
    type: 'smallint',
  })
  public readonly position!: number;

  @Column({
    name: 'turn',
    nullable: false,
    type: 'smallint',
  })
  public readonly turn!: number;
}
