import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'User',
})
export class UserDb {
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
  @Index({ unique: true })
  public readonly passwordHash!: string;
}
