import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';

import { GameDb } from './GameDb';

@Entity({
  name: 'GameAction',
})
@Index(['game', 'position'])
@Index(['game', 'turn'])
export class GameActionDb {
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
