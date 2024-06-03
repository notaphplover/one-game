import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameSlotWithUserIndex1717261608893
  implements MigrationInterface
{
  public readonly name: string = 'UpdateGameSlotWithUserIndex1717261608893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "game_slot_user_id_idx" ON "GameSlot" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."game_slot_user_id_idx"`);
  }
}
