import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameWithLastEvent1712868378201
  implements MigrationInterface
{
  public readonly name: string = 'UpdateGameWithLastEvent1712868378201';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" ADD "last_game_action_id" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "Game" ADD CONSTRAINT "FK_749d829eba05792e0d5b01d7794" FOREIGN KEY ("last_game_action_id") REFERENCES "GameAction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" DROP CONSTRAINT "FK_749d829eba05792e0d5b01d7794"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Game" DROP COLUMN "last_game_action_id"`,
    );
  }
}
