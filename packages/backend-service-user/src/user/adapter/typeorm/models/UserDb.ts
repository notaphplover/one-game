import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'User',
})
export class UserDb {
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
}
