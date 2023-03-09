import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserModel1678229103157 implements MigrationInterface {
  public readonly name: string = 'AddUserModel1678229103157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "User" ("email" character varying(255) NOT NULL, "id" character varying(36) NOT NULL, "name" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4a257d2c9837248d70640b3e36" ON "User" ("email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_efeb6027107de99418197e12fc" ON "User" ("password_hash") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_efeb6027107de99418197e12fc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a257d2c9837248d70640b3e36"`,
    );
    await queryRunner.query(`DROP TABLE "User"`);
  }
}
