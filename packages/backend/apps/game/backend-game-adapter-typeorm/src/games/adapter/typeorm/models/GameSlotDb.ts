import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
  Unique,
} from 'typeorm';

import { GameDb } from './GameDb';

@Entity({
  name: 'GameSlot',
})
@Unique('game_slot_game_id_position_key', ['game', 'position'])
@Unique('game_slot_game_id_user_id_key', ['game', 'userId'])
@Index('game_slot_user_id_idx', ['userId'])
export class GameSlotDb {
  @Column({
    name: 'cards',
    nullable: true,
    type: 'json',
  })
  public readonly cards!: string | null;

  @ManyToOne(
    () => GameDb,
    (gameDb: GameDb): GameSlotDb[] => gameDb.gameSlotsDb,
    { nullable: false },
  )
  @JoinColumn({ name: 'game_id' })
  public readonly game!: GameDb;

  @RelationId((gameSlot: GameSlotDb) => gameSlot.game)
  public readonly gameId!: string;

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
