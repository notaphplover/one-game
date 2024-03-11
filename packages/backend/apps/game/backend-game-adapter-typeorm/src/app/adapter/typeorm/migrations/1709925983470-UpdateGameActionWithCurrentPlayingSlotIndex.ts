import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameActionWithCurrentPlayingSlotIndex1709925983470
  implements MigrationInterface
{
  public readonly name: string =
    'UpdateGameActionWithCurrentPlayingSlotIndex1709925983470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GameAction" ADD "current_playing_slot" smallint NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GameAction" DROP COLUMN "current_playing_slot"`,
    );
  }
}
