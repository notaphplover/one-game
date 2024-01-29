import { DataSource, QueryRunner } from 'typeorm';

import { TransactionContext } from '../../../application/models/TransactionContext';

const IS_PROPERTY_SYMBOL: unique symbol = Symbol.for(
  'IsTypeOrmTransactionContext',
);

export class TypeOrmTransactionContext implements TransactionContext {
  public readonly [IS_PROPERTY_SYMBOL]: true;
  readonly #queryRunner: QueryRunner;

  private constructor(queryRunner: QueryRunner) {
    this[IS_PROPERTY_SYMBOL] = true;
    this.#queryRunner = queryRunner;
  }

  public static async build(
    dataSource: DataSource,
  ): Promise<TypeOrmTransactionContext> {
    const queryRunner: QueryRunner = dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    return new TypeOrmTransactionContext(queryRunner);
  }

  public static is(value: unknown): value is TypeOrmTransactionContext {
    return (
      value !== null &&
      typeof value === 'object' &&
      (value as Partial<TypeOrmTransactionContext>)[IS_PROPERTY_SYMBOL] === true
    );
  }

  public unwrap(): QueryRunner {
    return this.#queryRunner;
  }

  public async [Symbol.asyncDispose](): Promise<void> {
    try {
      await this.#queryRunner.commitTransaction();
    } catch (_error: unknown) {
      await this.#queryRunner.rollbackTransaction();
    } finally {
      await this.#queryRunner.release();
    }
  }
}
