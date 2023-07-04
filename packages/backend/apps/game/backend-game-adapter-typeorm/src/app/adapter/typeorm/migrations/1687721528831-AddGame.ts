import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGame1687721528831 implements MigrationInterface {
  public readonly name: string = 'AddGame1687721528831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "GameSlot" ("cards" json, "id" character varying(36) NOT NULL, "position" smallint, "user_id" character varying(36) NOT NULL, "game_id" character varying(36) NOT NULL, CONSTRAINT "game_slot_game_id_user_id_key" UNIQUE ("game_id", "user_id"), CONSTRAINT "game_slot_game_id_position_key" UNIQUE ("game_id", "position"), CONSTRAINT "PK_cdf9b59803dffd6fbf169931fb4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Game" ("current_card" bit(16), "current_color" bit(16), "current_direction" character varying(32), "current_playing_slot" smallint, "current_turn_cards_played" smallint, "deck" json NOT NULL, "draw_count" smallint, "id" character varying(36) NOT NULL, "game_slots_amount" smallint NOT NULL, "spec" json NOT NULL, "status" smallint NOT NULL, CONSTRAINT "PK_cce0ee17147c1830d09c19d4d56" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "GameOptions" ("chain_draw_2_draw_2_cards" smallint NOT NULL, "chain_draw_2_draw_4_cards" smallint NOT NULL, "chain_draw_4_draw_2_cards" smallint NOT NULL, "chain_draw_4_draw_4_cards" smallint NOT NULL, "id" character varying(36) NOT NULL, "play_card_is_mandatory" smallint NOT NULL, "play_multiple_same_cards" smallint NOT NULL, "play_wild_draw_4_if_no_other_alternative" smallint NOT NULL, "game_id" character varying(36) NOT NULL, CONSTRAINT "REL_0f39a7cfd9e6187857f4983bc2" UNIQUE ("game_id"), CONSTRAINT "PK_9f9cb04ec3683ff41383d38c9e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" ADD CONSTRAINT "FK_f707418ca3fd17eaa87ca5ba3db" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameOptions" ADD CONSTRAINT "FK_0f39a7cfd9e6187857f4983bc22" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GameSlot" DROP CONSTRAINT "FK_f707418ca3fd17eaa87ca5ba3db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameOptions" DROP CONSTRAINT "FK_0f39a7cfd9e6187857f4983bc22"`,
    );
    await queryRunner.query(`DROP TABLE "GameSlot"`);
    await queryRunner.query(`DROP TABLE "Game"`);
    await queryRunner.query(`DROP TABLE "GameOptions"`);
  }
}
