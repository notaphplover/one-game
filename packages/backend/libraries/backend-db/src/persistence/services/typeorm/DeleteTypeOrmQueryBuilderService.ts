import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  DeleteQueryBuilder,
  ObjectLiteral,
  QueryBuilder,
  Repository,
  WhereExpressionBuilder,
} from 'typeorm';

import { FindQueryTypeOrmFromQueryWithQueryBuilderBuilder } from '../../builders/typeorm/FindQueryTypeOrmFromQueryWithQueryBuilderBuilder';

export class DeleteTypeOrmQueryBuilderService<
  TModelDb extends ObjectLiteral,
  TQuery,
> {
  readonly #repository: Repository<TModelDb>;
  readonly #findQueryTypeOrmFromQueryBuilder:
    | Builder<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [TQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >
    | BuilderAsync<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [TQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >;

  constructor(
    repository: Repository<TModelDb>,
    findQueryTypeOrmFromQueryBuilder:
      | Builder<
          QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
          [TQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
        >
      | BuilderAsync<
          QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
          [TQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
        >,
  ) {
    this.#repository = repository;
    this.#findQueryTypeOrmFromQueryBuilder = findQueryTypeOrmFromQueryBuilder;
  }

  public async delete(query: TQuery): Promise<void> {
    const deleteQueryBuilder: DeleteQueryBuilder<TModelDb> = this.#repository
      .createQueryBuilder()
      .delete();

    const findQueryTypeOrmOrQueryBuilder: QueryBuilder<TModelDb> = await (
      this
        .#findQueryTypeOrmFromQueryBuilder as FindQueryTypeOrmFromQueryWithQueryBuilderBuilder<
        TModelDb,
        TQuery
      >
    ).build(query, deleteQueryBuilder);

    await (
      findQueryTypeOrmOrQueryBuilder as DeleteQueryBuilder<TModelDb>
    ).execute();
  }
}
