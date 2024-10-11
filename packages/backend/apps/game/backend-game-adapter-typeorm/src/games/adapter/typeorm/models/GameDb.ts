import { GameAction } from '@cornie-js/backend-game-domain/gameActions';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';

import { BinaryToNumberTransformer } from '../../../../foundation/db/adapter/typeorm/transformers/BinaryToNumberTransformer';
import { NumberToBooleanTransformer } from '../../../../foundation/db/adapter/typeorm/transformers/NumberToBooleanTransformer';
import { GameActionDb } from '../../../../gameActions/adapter/typeorm/models/GameActionDb';
import { GameDirectionDb } from './GameDirectionDb';
import { GameSlotDb } from './GameSlotDb';
import { GameSpecDb } from './GameSpecDb';
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
    name: 'current_turn_cards_drawn',
    nullable: true,
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly currentTurnCardsDrawn!: boolean | null;

  @Column({
    name: 'current_turn_cards_played',
    nullable: true,
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly currentTurnCardsPlayed!: boolean | null;

  @Column({
    length: 16,
    name: 'current_card_single_card_draw',
    nullable: true,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    transformer: new BinaryToNumberTransformer(16),
    type: 'bit',
  })
  public readonly currentTurnSingleCardDraw!: number | null;

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
  public readonly drawCount!: number | null;

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;

  @Column({
    name: 'is_public',
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly isPublic!: boolean;

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

  @OneToOne(
    () => GameSpecDb,
    (gameSpecDb: GameSpecDb): GameDb => gameSpecDb.game,
    {
      eager: true,
    },
  )
  public readonly gameSpecDb!: GameSpecDb;

  @ManyToOne(() => GameActionDb, undefined, { eager: true, nullable: true })
  @JoinColumn({ name: 'last_game_action_id' })
  public readonly lastGameAction!: GameAction | null;

  @RelationId((game: GameDb) => game.lastGameAction)
  public readonly lastGameActionId!: string | null;

  @Column({
    length: 255,
    name: 'name',
    nullable: true,
    type: 'varchar',
  })
  public readonly name!: string | null;

  @Column({
    name: 'skip_count',
    nullable: true,
    type: 'smallint',
    width: 4,
  })
  public readonly skipCount!: number | null;

  @Column({
    name: 'status',
    type: 'smallint',
    width: 2,
  })
  public readonly status!: GameStatusDb;

  @Column({
    name: 'turn',
    nullable: true,
    type: 'smallint',
  })
  public readonly turn!: number | null;

  @Column({
    name: 'turn_expires_at',
    nullable: true,
    type: 'timestamptz',
  })
  public readonly turnExpiresAt!: Date | null;
}
