import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserModel1678229103157 implements MigrationInterface {
  public readonly name: string = 'AddUserModel1678229103157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "User" ("active" smallint NOT NULL, "email" character varying(255) NOT NULL, "id" character varying(36) NOT NULL, "name" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4a257d2c9837248d70640b3e36" ON "User" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "UserCode" ("code" character varying(64) NOT NULL, "id" character varying(36) NOT NULL, "user_id" character varying(36) NOT NULL, CONSTRAINT "REL_bae6b6fddeec1705e7054cd0d1" UNIQUE ("user_id"), CONSTRAINT "PK_5d86e9b7d368a974392c3488889" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_59f4cd432ff883add965218bb2" ON "UserCode" ("code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserCode" ADD CONSTRAINT "FK_bae6b6fddeec1705e7054cd0d16" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserCode" DROP CONSTRAINT "FK_bae6b6fddeec1705e7054cd0d16"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_59f4cd432ff883add965218bb2"`,
    );
    await queryRunner.query(`DROP TABLE "UserCode"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a257d2c9837248d70640b3e36"`,
    );
    await queryRunner.query(`DROP TABLE "User"`);
  }
}
