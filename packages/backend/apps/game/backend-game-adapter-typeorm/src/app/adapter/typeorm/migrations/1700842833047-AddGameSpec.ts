import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameSpec1700842833047 implements MigrationInterface {
  public readonly name: string = 'AddGameSpec1700842833047';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "GameSpec" ("spec" json NOT NULL, "chain_draw_2_draw_2_cards" smallint NOT NULL, "chain_draw_2_draw_4_cards" smallint NOT NULL, "chain_draw_4_draw_2_cards" smallint NOT NULL, "chain_draw_4_draw_4_cards" smallint NOT NULL, "game_slots_amount" smallint NOT NULL, "id" character varying(36) NOT NULL, "play_card_is_mandatory" smallint NOT NULL, "play_multiple_same_cards" smallint NOT NULL, "play_wild_draw_4_if_no_other_alternative" smallint NOT NULL, "game_id" character varying(36) NOT NULL, CONSTRAINT "REL_031d897a639b67efeb5ae0024a" UNIQUE ("game_id"), CONSTRAINT "PK_ccccc1c569c0ecb3d7d32b890e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameSpec" ADD CONSTRAINT "FK_031d897a639b67efeb5ae0024a1" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GameSpec" DROP CONSTRAINT "FK_031d897a639b67efeb5ae0024a1"`,
    );
    await queryRunner.query(`DROP TABLE "GameSpec"`);
  }
}
