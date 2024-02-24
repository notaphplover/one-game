import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameHistory1708646400000 implements MigrationInterface {
  public readonly name: string = 'AddGameHistory1708646400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "GameAction" ("id" character varying(36) NOT NULL, "payload" json NOT NULL, "position" smallint NOT NULL, "turn" smallint NOT NULL, "game_id" character varying(36) NOT NULL, CONSTRAINT "PK_504414b3ee4d764e8df48118c0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_030557ed95c9537ffb33536d49" ON "GameAction" ("game_id", "turn")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ed74975e34bbce332c8b58525" ON "GameAction" ("game_id", "position")`,
    );
    await queryRunner.query(
      `CREATE TABLE "GameInitialSnapshotSlot" ("cards" json NOT NULL, "id" character varying(36) NOT NULL, "position" smallint, "user_id" character varying(36) NOT NULL, "game_initial_snapshot_id" character varying(36) NOT NULL, CONSTRAINT "PK_ab9464398b172ed7ff9c00a397d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "GameInitialSnapshot" ("current_card" bit(16) NOT NULL, "current_color" bit(16) NOT NULL, "current_direction" character varying(32) NOT NULL, "current_playing_slot" smallint NOT NULL, "deck" json NOT NULL, "draw_count" smallint NOT NULL, "id" character varying(36) NOT NULL, "game_id" character varying(36) NOT NULL, CONSTRAINT "PK_79de72d7a2e49d332bd7ad3ec41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameAction" ADD CONSTRAINT "FK_4ccd5dc231685b49a5355edaa46" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameInitialSnapshotSlot" ADD CONSTRAINT "FK_46af31c84986ba21bf4837025a5" FOREIGN KEY ("game_initial_snapshot_id") REFERENCES "GameInitialSnapshot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameInitialSnapshot" ADD CONSTRAINT "FK_be95245a47a081f63be111e22b0" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GameInitialSnapshot" DROP CONSTRAINT "FK_be95245a47a081f63be111e22b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameInitialSnapshotSlot" DROP CONSTRAINT "FK_46af31c84986ba21bf4837025a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameAction" DROP CONSTRAINT "FK_4ccd5dc231685b49a5355edaa46"`,
    );
    await queryRunner.query(`DROP TABLE "GameInitialSnapshot"`);
    await queryRunner.query(`DROP TABLE "GameInitialSnapshotSlot"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ed74975e34bbce332c8b58525"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_030557ed95c9537ffb33536d49"`,
    );
    await queryRunner.query(`DROP TABLE "GameAction"`);
  }
}
