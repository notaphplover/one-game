import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { BinaryToNumberTransformer } from '../../../../foundation/db/adapter/typeorm/transformers/BinaryToNumberTransformer';
import { NumberToBooleanTransformer } from '../../../../foundation/db/adapter/typeorm/transformers/NumberToBooleanTransformer';
import { GameDirectionDb } from './GameDirectionDb';
import { GameSlotDb } from './GameSlotDb';
import { GameStatusDb } from './GameStatusDb';

@Entity({
  name: 'Game',
})
export class GameDb {
  @Column({
    length: 16,
    name: 'current_card',
    nullable: true,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    transformer: new BinaryToNumberTransformer(16),
    type: 'bit',
  })
  public readonly currentCard!: number | null;

  @Column({
    length: 16,
    name: 'current_color',
    nullable: true,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    transformer: new BinaryToNumberTransformer(16),
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

  @Column({
    name: 'current_turn_cards_played',
    nullable: true,
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly currentTurnCardsPlayed!: boolean | null;

  @Column({
    name: 'deck',
    nullable: true,
    type: 'json',
  })
  public readonly deck!: string | null;

  @Column({
    name: 'discard_pile',
    type: 'json',
  })
  public readonly discardPile!: string;

  @Column({
    name: 'draw_count',
    nullable: true,
    type: 'smallint',
    width: 4,
  })
  public drawCount!: number | null;

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;

  @Column({
    name: 'game_slots_amount',
    nullable: false,
    type: 'smallint',
  })
  public readonly gameSlotsAmount!: number;

  @OneToMany(
    () => GameSlotDb,
    (gameSlotDb: GameSlotDb): GameDb => gameSlotDb.game,
    {
      eager: true,
    },
  )
  public readonly gameSlotsDb!: GameSlotDb[];

  @Column({
    name: 'spec',
    type: 'json',
  })
  public readonly spec!: string;

  @Column({
    name: 'status',
    type: 'smallint',
    width: 2,
  })
  public readonly status!: GameStatusDb;
}
