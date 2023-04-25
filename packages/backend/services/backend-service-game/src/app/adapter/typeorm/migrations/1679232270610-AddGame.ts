import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGame1679232270610 implements MigrationInterface {
  public readonly name: string = 'AddGame1679232270610';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "GameSlot" ("cards" json, "id" character varying(36) NOT NULL, "position" smallint, "user_id" character varying(36) NOT NULL, "game_id" character varying(36), CONSTRAINT "game_slot_game_id_user_id_key" UNIQUE ("game_id", "user_id"), CONSTRAINT "game_slot_game_id_position_key" UNIQUE ("game_id", "position"), CONSTRAINT "PK_cdf9b59803dffd6fbf169931fb4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Game" ("active" smallint NOT NULL, "current_card" bit(16), "current_color" bit(16), "current_direction" character varying(32), "current_playing_slot" smallint, "deck" json NOT NULL, "id" character varying(36) NOT NULL, "game_slots_amount" smallint NOT NULL, "spec" json NOT NULL, CONSTRAINT "PK_cce0ee17147c1830d09c19d4d56" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSlot" ADD CONSTRAINT "FK_f707418ca3fd17eaa87ca5ba3db" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GameSlot" DROP CONSTRAINT "FK_f707418ca3fd17eaa87ca5ba3db"`,
    );
    await queryRunner.query(`DROP TABLE "Game"`);
    await queryRunner.query(`DROP TABLE "GameSlot"`);
  }
}
