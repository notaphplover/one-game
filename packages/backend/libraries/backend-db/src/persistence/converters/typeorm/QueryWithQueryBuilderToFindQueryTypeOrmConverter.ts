import { ConverterAsync } from '@cornie-js/backend-common';
import {
  FindManyOptions,
  ObjectLiteral,
  QueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

export type QueryWithQueryBuilderToFindQueryTypeOrmConverter<
  TModelDb extends ObjectLiteral,
  TQuery,
> = ConverterAsync<
  TQuery,
  FindManyOptions<TModelDb> | (QueryBuilder<TModelDb> & WhereExpressionBuilder),
  QueryBuilder<TModelDb> & WhereExpressionBuilder
>;
