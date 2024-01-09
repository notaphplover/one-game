import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveGameOptions1700955127703 implements MigrationInterface {
  public readonly name: string = 'RemoveGameOptions1700955127703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "GameOptions" DROP CONSTRAINT "FK_0f39a7cfd9e6187857f4983bc22"`,
    );
    await queryRunner.query(`DROP TABLE "GameOptions"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "GameOptions" ("chain_draw_2_draw_2_cards" smallint NOT NULL, "chain_draw_2_draw_4_cards" smallint NOT NULL, "chain_draw_4_draw_2_cards" smallint NOT NULL, "chain_draw_4_draw_4_cards" smallint NOT NULL, "id" character varying(36) NOT NULL, "play_card_is_mandatory" smallint NOT NULL, "play_multiple_same_cards" smallint NOT NULL, "play_wild_draw_4_if_no_other_alternative" smallint NOT NULL, "game_id" character varying(36) NOT NULL, CONSTRAINT "REL_0f39a7cfd9e6187857f4983bc2" UNIQUE ("game_id"), CONSTRAINT "PK_9f9cb04ec3683ff41383d38c9e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "GameOptions" ADD CONSTRAINT "FK_0f39a7cfd9e6187857f4983bc22" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
