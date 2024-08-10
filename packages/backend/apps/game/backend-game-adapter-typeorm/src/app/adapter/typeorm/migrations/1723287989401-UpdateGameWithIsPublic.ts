import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameWithIsPublic1723287989401 implements MigrationInterface {
  public readonly name: string = 'UpdateGameWithIsPublic1723287989401';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" ADD "is_public" smallint NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "is_public"`);
  }
}
