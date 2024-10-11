import { MigrationInterface } from 'typeorm';
import { QueryRunner } from 'typeorm/browser';

export class UpdateGameWithTurnExpiresAt1728639017623
  implements MigrationInterface
{
  public readonly name: string = 'UpdateGameWithTurnExpiresAt1728639017623';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" ADD "turn_expires_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Game" DROP COLUMN "turn_expires_at"`);
  }
}
