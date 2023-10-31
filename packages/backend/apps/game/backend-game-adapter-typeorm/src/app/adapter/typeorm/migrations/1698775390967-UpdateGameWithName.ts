import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameWithName1698775390967 implements MigrationInterface {
  public readonly name: string = 'UpdateGameWithName1698775390967';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" ADD "name" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "name"`);
  }
}
