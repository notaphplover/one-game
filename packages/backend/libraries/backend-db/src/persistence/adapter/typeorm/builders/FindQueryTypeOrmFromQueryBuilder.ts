import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  FindManyOptions,
  ObjectLiteral,
  QueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

export type FindQueryTypeOrmFromQueryBuilder<
  TModelDb extends ObjectLiteral,
  TQuery,
> =
  | Builder<FindManyOptions<TModelDb>, [TQuery]>
  | BuilderAsync<FindManyOptions<TModelDb>, [TQuery]>
  | Builder<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [TQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >
  | BuilderAsync<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [TQuery, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >;
