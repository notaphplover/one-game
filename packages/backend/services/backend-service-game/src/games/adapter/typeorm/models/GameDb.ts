import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { NumberToBooleanTransformer } from '../../../../foundation/db/adapter/typeorm/transformers/NumberToBooleanTransformer';
import { GameDirectionDb } from './GameDirectionDb';
import { GameSlotDb } from './GameSlotDb';

@Entity({
  name: 'Game',
})
export class GameDb {
  @Column({
    name: 'active',
    transformer: new NumberToBooleanTransformer(),
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
    length: 32,
    name: 'current_direction',
    nullable: true,
    type: 'varchar',
  })
  public readonly currentDirection!: GameDirectionDb | null;

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

  @OneToMany(
    () => GameSlotDb,
    (gameSlotDb: GameSlotDb): GameDb => gameSlotDb.game,
    {
      cascade: true,
      eager: true,
    },
  )
  public readonly gameSlotsDb!: GameSlotDb[];

  @Column({
    name: 'specs',
    nullable: true,
    type: 'json',
  })
  public readonly specs!: string;
}
