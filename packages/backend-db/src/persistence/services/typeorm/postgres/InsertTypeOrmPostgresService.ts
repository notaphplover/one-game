import { AppError, AppErrorKind } from '@one-game-js/backend-common';
import { ObjectLiteral, QueryFailedError } from 'typeorm';

import { InsertTypeOrmService } from '../InsertTypeOrmService';

const PG_DUPLICATE_KEY_ERROR_CODE: number = 23505;

interface PgDatabaseError extends Record<string, unknown> {
  code: string;
  detail: string | undefined;
}

export class InsertTypeOrmPostgresService<
  TModel,
  TModelDb extends ObjectLiteral,
  TQuery,
> extends InsertTypeOrmService<TModel, TModelDb, TQuery> {
  public override async insertOne(query: TQuery): Promise<TModel> {
    try {
      return await super.insertOne(query);
    } catch (error) {
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
      (value as QueryFailedError).driverError !== undefined
    );
  }

  #isObjectWithCodeError(value: unknown): value is PgDatabaseError {
    return (
      typeof value === 'object' &&
      typeof (value as PgDatabaseError).code === 'string' &&
      (typeof (value as PgDatabaseError).detail === 'string' ||
        (value as PgDatabaseError).detail === undefined)
    );
  }
}
