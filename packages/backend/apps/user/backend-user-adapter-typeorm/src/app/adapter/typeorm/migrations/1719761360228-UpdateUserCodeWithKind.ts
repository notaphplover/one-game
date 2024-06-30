import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserCodeWithKind1719761360228 implements MigrationInterface {
  public readonly name: string = 'UpdateUserCodeWithKind1719761360228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserCode" ADD "kind" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "UserCode" DROP COLUMN "kind"`);
  }
}
