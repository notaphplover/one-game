import { Column, Entity, JoinTable, OneToMany, PrimaryColumn } from 'typeorm';

import { GameSlotDb } from './GameSlotDb';

@Entity({
  name: 'Game',
})
export class GameDb {
  @Column({
    name: 'active',
    type: 'smallint',
    width: 1,
  })
  public readonly active!: boolean;

  @Column({
    length: 16,
    name: 'current_card',
    nullable: true,
    type: 'bit',
  })
  public readonly currentCard!: number | null;

  @Column({
    length: 16,
    name: 'current_color',
    nullable: true,
    type: 'bit',
  })
  public readonly currentColor!: number | null;

  @Column({
    name: 'current_playing_slot',
    nullable: true,
    type: 'smallint',
  })
  public readonly currentPlayingSlotIndex!: number | null;

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;

  @OneToMany(() => GameSlotDb, (gameSlotDb: GameSlotDb) => gameSlotDb.gameId, {
    eager: true,
  })
  @JoinTable()
  public readonly gameSlotsDb!: GameSlotDb[];

  @Column({
    name: 'specs',
    nullable: true,
    type: 'json',
  })
  public readonly specs!: string;
}
