import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  ObjectLiteral,
  QueryBuilder,
  QueryRunner,
  Repository,
  UpdateQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { TransactionWrapper } from '../../../application/models/TransactionWrapper';
import { unwrapTypeOrmTransaction } from '../utils/unwrapTypeOrmTransaction';

export class UpdateTypeOrmQueryBuilderService<
  TModelDb extends ObjectLiteral,
  TQuery,
> {
  readonly #repository: Repository<TModelDb>;
  readonly #findQueryTypeOrmFromUpdateQueryBuilder:
    | Builder<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [TQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >
    | BuilderAsync<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [TQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >;
  readonly #setQueryTypeOrmFromUpdateQueryBuilder:
    | Builder<QueryDeepPartialEntity<TModelDb>, [TQuery]>
    | BuilderAsync<QueryDeepPartialEntity<TModelDb>, [TQuery]>;

  constructor(
    repository: Repository<TModelDb>,
    findQueryTypeOrmFromUpdateQueryBuilder:
      | Builder<
          QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
          [TQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
        >
      | BuilderAsync<
          QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
          [TQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
        >,
    setQueryTypeOrmFromUpdateQueryBuilder:
      | Builder<QueryDeepPartialEntity<TModelDb>, [TQuery]>
      | BuilderAsync<QueryDeepPartialEntity<TModelDb>, [TQuery]>,
  ) {
    this.#repository = repository;
    this.#findQueryTypeOrmFromUpdateQueryBuilder =
      findQueryTypeOrmFromUpdateQueryBuilder;
    this.#setQueryTypeOrmFromUpdateQueryBuilder =
      setQueryTypeOrmFromUpdateQueryBuilder;
  }

  public async update(
    query: TQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<void> {
    const updateQueryBuilder: UpdateQueryBuilder<TModelDb> =
      this.#createQueryBuilder(transactionWrapper);

    const findQueryTypeOrmOrQueryBuilder: QueryBuilder<ObjectLiteral> =
      await this.#findQueryTypeOrmFromUpdateQueryBuilder.build(
        query,
        updateQueryBuilder as UpdateQueryBuilder<ObjectLiteral>,
      );

    const setQueryTypeOrm: QueryDeepPartialEntity<TModelDb> =
      await this.#setQueryTypeOrmFromUpdateQueryBuilder.build(query);

    await (findQueryTypeOrmOrQueryBuilder as UpdateQueryBuilder<TModelDb>)
      .set(setQueryTypeOrm)
      .execute();
  }

  #createQueryBuilder(
    transactionWrapper: TransactionWrapper | undefined,
  ): UpdateQueryBuilder<TModelDb> {
    const queryRunner: QueryRunner | undefined =
      unwrapTypeOrmTransaction(transactionWrapper);

    const updateQueryBuilder: UpdateQueryBuilder<TModelDb> = this.#repository
      /*
       * https://github.com/typeorm/typeorm/issues/1798 prevents us from using instead:
       *
       * .createQueryBuilder(this.#repository.metadata.name)
       */
      .createQueryBuilder(undefined, queryRunner)
      .update();

    return updateQueryBuilder;
  }
}
