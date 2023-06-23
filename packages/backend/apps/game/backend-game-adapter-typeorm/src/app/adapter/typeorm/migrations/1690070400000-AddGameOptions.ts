import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameOptions1690070400000 implements MigrationInterface {
  public readonly name: string = 'AddGameOptions1690070400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "GameOptions" ("chain_draw_2_draw_2_cards" smallint NOT NULL, "chain_draw_2_draw_4_cards" smallint NOT NULL, "chain_draw_4_draw_2_cards" smallint NOT NULL, "chain_draw_4_draw_4_cards" smallint NOT NULL, "id" character varying(36) NOT NULL, "play_card_is_mandatory" smallint NOT NULL, "play_multiple_same_cards" smallint NOT NULL, "play_wild_draw_4_if_no_other_alternative" smallint NOT NULL, "game_id" character varying(36) NOT NULL, CONSTRAINT "REL_0f39a7cfd9e6187857f4983bc2" UNIQUE ("game_id"), CONSTRAINT "PK_9f9cb04ec3683ff41383d38c9e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" DROP CONSTRAINT "FK_f707418ca3fd17eaa87ca5ba3db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" DROP CONSTRAINT "game_slot_game_id_user_id_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" DROP CONSTRAINT "game_slot_game_id_position_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" ALTER COLUMN "game_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" ADD CONSTRAINT "game_slot_game_id_user_id_key" UNIQUE ("game_id", "user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" ADD CONSTRAINT "game_slot_game_id_position_key" UNIQUE ("game_id", "position")`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" ADD CONSTRAINT "FK_f707418ca3fd17eaa87ca5ba3db" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameOptions" ADD CONSTRAINT "FK_0f39a7cfd9e6187857f4983bc22" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "GameOptions"`);
    await queryRunner.query(
      `ALTER TABLE "GameSlot" ADD CONSTRAINT "FK_f707418ca3fd17eaa87ca5ba3db" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" ADD CONSTRAINT "game_slot_game_id_user_id_key" UNIQUE ("user_id", "game_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" ADD CONSTRAINT "game_slot_game_id_position_key" UNIQUE ("position", "game_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" ALTER COLUMN "game_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" DROP CONSTRAINT "game_slot_game_id_user_id_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" DROP CONSTRAINT "game_slot_game_id_position_key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" DROP CONSTRAINT "FK_f707418ca3fd17eaa87ca5ba3db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameOptions" DROP CONSTRAINT "FK_0f39a7cfd9e6187857f4983bc22"`,
    );
  }
}
