import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameWithSkipCount1709405917920
  implements MigrationInterface
{
  public readonly name: string = 'UpdateGameWithSkipCount1709405917920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Game" ADD "skip_count" smallint`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "skip_count"`);
  }
}
