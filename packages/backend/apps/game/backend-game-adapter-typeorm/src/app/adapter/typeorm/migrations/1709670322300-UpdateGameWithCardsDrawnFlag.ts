import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameWithCardsDrawnFlag1709670322300
  implements MigrationInterface
{
  public readonly name: string = 'UpdateGameWithCardsDrawnFlag1709670322300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" ADD "current_turn_cards_drawn" smallint`,
    );
    await queryRunner.query(
      `ALTER TABLE "Game" ADD "current_card_single_card_draw" bit(16)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Game" DROP COLUMN "current_card_single_card_draw"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Game" DROP COLUMN "current_turn_cards_drawn"`,
    );
  }
}
