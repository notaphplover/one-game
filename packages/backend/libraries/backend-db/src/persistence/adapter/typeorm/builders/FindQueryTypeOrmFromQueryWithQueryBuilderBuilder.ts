import { BuilderAsync } from '@cornie-js/backend-common';
import {
  FindManyOptions,
  ObjectLiteral,
  QueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

export type FindQueryTypeOrmFromQueryWithQueryBuilderBuilder<
  TModelDb extends ObjectLiteral,
  TQuery,
> = BuilderAsync<
  QueryBuilder<TModelDb> & WhereExpressionBuilder,
  [
    TQuery,
    (
      | FindManyOptions<TModelDb>
      | (QueryBuilder<TModelDb> & WhereExpressionBuilder)
    ),
  ]
>;
