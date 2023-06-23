import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';

import { NumberToBooleanTransformer } from '../../../../foundation/db/adapter/typeorm/transformers/NumberToBooleanTransformer';
import { GameDb } from './GameDb';

@Entity({
  name: 'GameOptions',
})
export class GameOptionsDb {
  @Column({
    name: 'chain_draw_2_draw_2_cards',
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly chainDraw2Draw2Cards!: boolean;

  @Column({
    name: 'chain_draw_2_draw_4_cards',
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly chainDraw2Draw4Cards!: boolean;

  @Column({
    name: 'chain_draw_4_draw_2_cards',
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly chainDraw4Draw2Cards!: boolean;

  @Column({
    name: 'chain_draw_4_draw_4_cards',
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly chainDraw4Draw4Cards!: boolean;

  @OneToOne(() => GameDb, { nullable: false })
  @JoinColumn({ name: 'game_id' })
  public readonly game!: GameDb;

  @RelationId((gameOptions: GameOptionsDb) => gameOptions.game)
  public readonly gameId!: string;

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;

  @Column({
    name: 'play_card_is_mandatory',
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly playCardIsMandatory!: boolean;

  @Column({
    name: 'play_multiple_same_cards',
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly playMultipleSameCards!: boolean;

  @Column({
    name: 'play_wild_draw_4_if_no_other_alternative',
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly playWildDraw4IfNoOtherAlternative!: boolean;
}
