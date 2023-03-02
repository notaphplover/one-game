import { ConverterAsync } from '@one-game-js/backend-common';
import {
  FindManyOptions,
  ObjectLiteral,
  QueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

export type QueryToFindQueryTypeOrmConverter<
  TModelDb extends ObjectLiteral,
  TQuery,
> =
  | ConverterAsync<TQuery, FindManyOptions<TModelDb>>
  | ConverterAsync<
      TQuery,
      QueryBuilder<TModelDb> & WhereExpressionBuilder,
      QueryBuilder<TModelDb> & WhereExpressionBuilder
    >;
