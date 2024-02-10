import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

import { NumberToBooleanTransformer } from '../../../../foundation/db/adapter/typeorm/transformers/NumberToBooleanTransformer';

@Entity({
  name: 'RefreshToken',
})
@Index(['family'])
@Index(['family', 'active', 'createdAt'])
export class RefreshTokenDb {
  @Column({
    name: 'active',
    nullable: false,
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly active!: boolean | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public readonly createdAt!: Date;

  @Column({
    length: 36,
    name: 'family',
    type: 'varchar',
  })
  public readonly family!: string;

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;

  @Column({
    length: 8192,
    name: 'token',
    type: 'varchar',
  })
  public readonly token!: string;
}
