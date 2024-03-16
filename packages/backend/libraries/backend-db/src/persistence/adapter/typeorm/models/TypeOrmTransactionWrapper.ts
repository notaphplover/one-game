import { DataSource, QueryRunner } from 'typeorm';

import { TransactionWrapper } from '../../../application/models/TransactionWrapper';

const IS_PROPERTY_SYMBOL: unique symbol = Symbol.for(
  'IsTypeOrmTransactionWrapper',
);

export class TypeOrmTransactionWrapper implements TransactionWrapper {
  public readonly [IS_PROPERTY_SYMBOL]: true;
  readonly #queryRunner: QueryRunner;

  private constructor(queryRunner: QueryRunner) {
    this[IS_PROPERTY_SYMBOL] = true;
    this.#queryRunner = queryRunner;
  }

  public static async build(
    dataSource: DataSource,
  ): Promise<TypeOrmTransactionWrapper> {
    const queryRunner: QueryRunner = dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    return new TypeOrmTransactionWrapper(queryRunner);
  }

  public static is(value: unknown): value is TypeOrmTransactionWrapper {
    return (
      value !== null &&
      typeof value === 'object' &&
      (value as Partial<TypeOrmTransactionWrapper>)[IS_PROPERTY_SYMBOL] === true
    );
  }

  public async [Symbol.asyncDispose](): Promise<void> {
    if (!this.#queryRunner.isReleased) {
      await this.rollback();
    }
  }

  public async rollback(): Promise<void> {
    try {
      await this.#queryRunner.rollbackTransaction();
    } finally {
      await this.#queryRunner.release();
    }
  }

  public async tryCommit(): Promise<void> {
    try {
      await this.#queryRunner.commitTransaction();
    } catch (error: unknown) {
      await this.#queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await this.#queryRunner.release();
    }
  }

  public unwrap(): QueryRunner {
    return this.#queryRunner;
  }
}
