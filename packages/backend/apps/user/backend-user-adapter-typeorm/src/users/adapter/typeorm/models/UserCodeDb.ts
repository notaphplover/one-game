import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';

import { UserCodeKindDb } from './UserCodeKindDb';
import { UserDb } from './UserDb';

@Entity({
  name: 'UserCode',
})
export class UserCodeDb {
  @Column({
    length: 64,
    name: 'code',
    type: 'varchar',
  })
  @Index({ unique: true })
  public readonly code!: string;

  @PrimaryColumn({
    length: 36,
    name: 'id',
    type: 'varchar',
  })
  public readonly id!: string;

  @Column({
    length: 255,
    name: 'kind',
    nullable: true,
    type: 'varchar',
  })
  public readonly kind!: UserCodeKindDb | null;

  @OneToOne(() => UserDb, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  public readonly user!: UserDb;

  @RelationId((userCode: UserCodeDb) => userCode.user)
  public readonly userId!: string;
}
