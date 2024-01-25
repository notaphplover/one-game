import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  FindManyOptions,
  ObjectLiteral,
  QueryBuilder,
  Repository,
  UpdateQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { FindQueryTypeOrmFromQueryBuilder } from '../../builders/typeorm/FindQueryTypeOrmFromQueryBuilder';
import { FindQueryTypeOrmFromQueryWithQueryBuilderBuilder } from '../../builders/typeorm/FindQueryTypeOrmFromQueryWithQueryBuilderBuilder';
import { findManyOptionsToFindOptionsWhere } from '../../utils/typeorm/findManyOptionsToFindOptionsWhere';
import { isQueryBuilder } from '../../utils/typeorm/isQueryBuilder';

export class UpdateTypeOrmService<TModelDb extends ObjectLiteral, TQuery> {
  readonly #repository: Repository<TModelDb>;
  readonly #findQueryTypeOrmFromUpdateQueryBuilder: FindQueryTypeOrmFromQueryBuilder<
    TModelDb,
    TQuery
  >;
  readonly #setQueryTypeOrmFromUpdateQueryBuilder:
    | Builder<QueryDeepPartialEntity<TModelDb>, [TQuery]>
    | BuilderAsync<QueryDeepPartialEntity<TModelDb>, [TQuery]>;

  constructor(
    repository: Repository<TModelDb>,
    findQueryTypeOrmFromUpdateQueryBuilder: FindQueryTypeOrmFromQueryBuilder<
      TModelDb,
      TQuery
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
        .#findQueryTypeOrmFromUpdateQueryBuilder as FindQueryTypeOrmFromQueryWithQueryBuilderBuilder<
        TModelDb,
        TQuery
      >
    ).build(query, updateQueryBuilder);
    const setQueryTypeOrm: QueryDeepPartialEntity<TModelDb> =
      await this.#setQueryTypeOrmFromUpdateQueryBuilder.build(query);

    if (isQueryBuilder<TModelDb>(findQueryTypeOrmOrQueryBuilder)) {
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
