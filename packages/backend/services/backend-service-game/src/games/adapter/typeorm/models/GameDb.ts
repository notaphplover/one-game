import { Column, Entity, PrimaryColumn } from 'typeorm';

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
  public readonly currentCard!: string;

  @Column({
    length: 16,
    name: 'current_color',
    nullable: true,
    type: 'bit',
  })
  public readonly currentColor!: string;

  @Column({
    name: 'current_playing_slot',
    nullable: true,
    type: 'smallint',
  })
  public readonly currentPlayingSlotIndex!: number;

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;
}
