import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { ObjectLiteral, QueryFailedError } from 'typeorm';

import { TransactionWrapper } from '../../../../application/models/TransactionWrapper';
import { InsertTypeOrmQueryBuilderService } from '../InsertTypeOrmQueryBuilderService';

const PG_DUPLICATE_KEY_ERROR_CODE: number = 23505;

interface PgDatabaseError extends Record<string, unknown> {
  code: string;
  detail: string | undefined;
}

export class InsertTypeOrmQueryBuilderPostgresService<
  TModel,
  TModelDb extends ObjectLiteral,
  TQuery,
> extends InsertTypeOrmQueryBuilderService<TModel, TModelDb, TQuery> {
  public override async insertOne(
    query: TQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<TModel> {
    try {
      return await super.insertOne(query, transactionWrapper);
    } catch (error: unknown) {
      this.#handleError(error);
    }
  }

  #handleError(error: unknown): never {
    if (
      this.#isQueryFailedError(error) &&
      this.#isObjectWithCodeError(error.driverError)
    ) {
      if (error.driverError.code === PG_DUPLICATE_KEY_ERROR_CODE.toString()) {
        let errorMessage: string = 'The entity cannot be created';

        if (error.driverError.detail !== undefined) {
          errorMessage += '. ' + error.driverError.detail;
        }

        throw new AppError(AppErrorKind.entityConflict, errorMessage);
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }

  #isQueryFailedError(value: unknown): value is QueryFailedError {
    return (
      value !== null &&
      typeof value === 'object' &&
      (value as Partial<QueryFailedError>).driverError !== undefined
    );
  }

  #isObjectWithCodeError(value: unknown): value is PgDatabaseError {
    return (
      value !== null &&
      typeof value === 'object' &&
      typeof (value as PgDatabaseError).code === 'string' &&
      (typeof (value as PgDatabaseError).detail === 'string' ||
        (value as PgDatabaseError).detail === undefined)
    );
  }
}
