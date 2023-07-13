import { Converter, ConverterAsync } from '@cornie-js/backend-common';
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
  | Converter<TQuery, FindManyOptions<TModelDb>>
  | ConverterAsync<TQuery, FindManyOptions<TModelDb>>
  | Converter<
      TQuery,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >
  | ConverterAsync<
      TQuery,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
    >;
