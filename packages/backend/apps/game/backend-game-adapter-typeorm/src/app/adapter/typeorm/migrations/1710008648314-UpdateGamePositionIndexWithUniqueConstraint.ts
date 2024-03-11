import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGamePositionIndexWithUniqueConstraint1710008648314
  implements MigrationInterface
{
  public readonly name: string =
    'UpdateGamePositionIndexWithUniqueConstraint1710008648314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ed74975e34bbce332c8b58525"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7ed74975e34bbce332c8b58525" ON "GameAction" ("game_id", "position")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ed74975e34bbce332c8b58525"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ed74975e34bbce332c8b58525" ON "GameAction" ("position", "game_id")`,
    );
  }
}
