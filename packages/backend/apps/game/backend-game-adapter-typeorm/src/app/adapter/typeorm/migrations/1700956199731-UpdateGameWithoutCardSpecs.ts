import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameWithoutCardSpecs1700956199731
  implements MigrationInterface
{
  public readonly name: string = 'UpdateGameWithoutCardSpecs1700956199731';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "spec"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Game" ADD "spec" json NOT NULL`);
  }
}
