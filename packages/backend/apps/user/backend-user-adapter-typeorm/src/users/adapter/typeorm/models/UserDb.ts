import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { NumberToBooleanTransformer } from '../../../../foundation/db/adapter/typeorm/transformers/NumberToBooleanTransformer';

@Entity({
  name: 'User',
})
export class UserDb {
  @Column({
    name: 'active',
    nullable: false,
    transformer: new NumberToBooleanTransformer(),
    type: 'smallint',
    width: 1,
  })
  public readonly active!: boolean;

  @Column({
    length: 255,
    name: 'email',
    type: 'varchar',
  })
  @Index({ unique: true })
  public readonly email!: string;

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;

  @Column({
    length: 255,
    name: 'name',
    type: 'varchar',
  })
  public readonly name!: string;

  @Column({
    length: 255,
    name: 'password_hash',
    type: 'varchar',
  })
  public readonly passwordHash!: string;
}
