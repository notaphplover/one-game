import {
  DeleteQueryBuilder,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  QueryBuilder,
  Repository,
} from 'typeorm';

import { FindQueryTypeOrmFromQueryBuilder } from '../../builders/typeorm/FindQueryTypeOrmFromQueryBuilder';
import { FindQueryTypeOrmFromQueryWithQueryBuilderBuilder } from '../../builders/typeorm/FindQueryTypeOrmFromQueryWithQueryBuilderBuilder';
import { findManyOptionsToFindOptionsWhere } from '../../utils/typeorm/findManyOptionsToFindOptionsWhere';
import { isQueryBuilder } from '../../utils/typeorm/isQueryBuilder';

export class DeleteTypeOrmService<TModelDb extends ObjectLiteral, TQuery> {
  readonly #repository: Repository<TModelDb>;
  readonly #findQueryTypeOrmFromQueryBuilder: FindQueryTypeOrmFromQueryBuilder<
    TModelDb,
    TQuery
  >;

  constructor(
    repository: Repository<TModelDb>,
    findQueryTypeOrmFromQueryBuilder: FindQueryTypeOrmFromQueryBuilder<
      TModelDb,
      TQuery
    >,
  ) {
    this.#repository = repository;
    this.#findQueryTypeOrmFromQueryBuilder = findQueryTypeOrmFromQueryBuilder;
  }

  public async delete(query: TQuery): Promise<void> {
    const deleteQueryBuilder: DeleteQueryBuilder<TModelDb> = this.#repository
      .createQueryBuilder()
      .delete();

    const findQueryTypeOrmOrQueryBuilder:
      | FindManyOptions<TModelDb>
      | QueryBuilder<TModelDb> = await (
      this
        .#findQueryTypeOrmFromQueryBuilder as FindQueryTypeOrmFromQueryWithQueryBuilderBuilder<
        TModelDb,
        TQuery
      >
    ).build(query, deleteQueryBuilder);

    if (isQueryBuilder<TModelDb>(findQueryTypeOrmOrQueryBuilder)) {
      await (
        findQueryTypeOrmOrQueryBuilder as DeleteQueryBuilder<TModelDb>
      ).execute();
    } else {
      const findQueryTypeOrmWhere: FindOptionsWhere<TModelDb> =
        findManyOptionsToFindOptionsWhere(findQueryTypeOrmOrQueryBuilder);

      await this.#repository.delete(findQueryTypeOrmWhere);
    }
  }
}
