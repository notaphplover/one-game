import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenModel1707511666604 implements MigrationInterface {
  public readonly name: string = 'AddRefreshTokenModel1707511666604';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "RefreshToken" ("active" smallint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "family" character varying(36) NOT NULL, "id" character varying(36) NOT NULL, "token" character varying(8192) NOT NULL, CONSTRAINT "PK_e5efef1572bd829464edc903d19" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_657a5d218a1b649b5a49066c1d" ON "RefreshToken" ("family", "active", "created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_83077c306733fdd970dc935338" ON "RefreshToken" ("family")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_83077c306733fdd970dc935338"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_657a5d218a1b649b5a49066c1d"`,
    );
    await queryRunner.query(`DROP TABLE "RefreshToken"`);
  }
}
