import { Converter, ConverterAsync } from '@cornie-js/backend-common';
import {
  FindManyOptions,
  ObjectLiteral,
  QueryBuilder,
  Repository,
  UpdateQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { QueryToFindQueryTypeOrmConverter } from '../../converters/typeorm/QueryToFindQueryTypeOrmConverter';
import { QueryWithQueryBuilderToFindQueryTypeOrmConverter } from '../../converters/typeorm/QueryWithQueryBuilderToFindQueryTypeOrmConverter';
import { findManyOptionsToFindOptionsWhere } from '../../utils/typeorm/findManyOptionsToFindOptionsWhere';

export class UpdateTypeOrmService<TModelDb extends ObjectLiteral, TQuery> {
  readonly #repository: Repository<TModelDb>;
  readonly #updateQueryToFindQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
    TModelDb,
    TQuery
  >;
  readonly #updateQueryToSetQueryTypeOrmConverter:
    | Converter<TQuery, QueryDeepPartialEntity<TModelDb>>
    | ConverterAsync<TQuery, QueryDeepPartialEntity<TModelDb>>;

  constructor(
    repository: Repository<TModelDb>,
    updateQueryToFindQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
      TModelDb,
      TQuery
    >,
    updateQueryToSetQueryTypeOrmConverter:
      | Converter<TQuery, QueryDeepPartialEntity<TModelDb>>
      | ConverterAsync<TQuery, QueryDeepPartialEntity<TModelDb>>,
  ) {
    this.#repository = repository;
    this.#updateQueryToFindQueryTypeOrmConverter =
      updateQueryToFindQueryTypeOrmConverter;
    this.#updateQueryToSetQueryTypeOrmConverter =
      updateQueryToSetQueryTypeOrmConverter;
  }

  public async update(query: TQuery): Promise<void> {
    const updateQueryBuilder: UpdateQueryBuilder<TModelDb> = this.#repository
      /*
       * https://github.com/typeorm/typeorm/issues/1798 prevents us from using instead:
       *
       * .createQueryBuilder(this.#repository.metadata.name)
       */
      .createQueryBuilder()
      .update();
    const findQueryTypeOrmOrQueryBuilder:
      | FindManyOptions<TModelDb>
      | QueryBuilder<TModelDb> = await (
      this
        .#updateQueryToFindQueryTypeOrmConverter as QueryWithQueryBuilderToFindQueryTypeOrmConverter<
        TModelDb,
        TQuery
      >
    ).convert(query, updateQueryBuilder);
    const setQueryTypeOrm: QueryDeepPartialEntity<TModelDb> =
      await this.#updateQueryToSetQueryTypeOrmConverter.convert(query);

    if (findQueryTypeOrmOrQueryBuilder instanceof QueryBuilder) {
      await (findQueryTypeOrmOrQueryBuilder as UpdateQueryBuilder<TModelDb>)
        .set(setQueryTypeOrm)
        .execute();
    } else {
      await this.#repository.update(
        findManyOptionsToFindOptionsWhere(findQueryTypeOrmOrQueryBuilder),
        setQueryTypeOrm,
      );
    }
  }
}
