import {
  DeleteQueryBuilder,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  QueryBuilder,
  Repository,
} from 'typeorm';

import { QueryToFindQueryTypeOrmConverter } from '../../converters/typeorm/QueryToFindQueryTypeOrmConverter';
import { QueryWithQueryBuilderToFindQueryTypeOrmConverter } from '../../converters/typeorm/QueryWithQueryBuilderToFindQueryTypeOrmConverter';
import { findManyOptionsToFindOptionsWhere } from '../../utils/typeorm/findManyOptionsToFindOptionsWhere';

export class DeleteTypeOrmService<TModelDb extends ObjectLiteral, TQuery> {
  readonly #repository: Repository<TModelDb>;
  readonly #queryToQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
    TModelDb,
    TQuery
  >;

  constructor(
    repository: Repository<TModelDb>,
    queryToQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
      TModelDb,
      TQuery
    >,
  ) {
    this.#repository = repository;
    this.#queryToQueryTypeOrmConverter = queryToQueryTypeOrmConverter;
  }

  public async delete(query: TQuery): Promise<void> {
    const deleteQueryBuilder: DeleteQueryBuilder<TModelDb> = this.#repository
      .createQueryBuilder()
      .delete();

    const findQueryTypeOrmOrQueryBuilder:
      | FindManyOptions<TModelDb>
      | QueryBuilder<TModelDb> = await (
      this
        .#queryToQueryTypeOrmConverter as QueryWithQueryBuilderToFindQueryTypeOrmConverter<
        TModelDb,
        TQuery
      >
    ).convert(query, deleteQueryBuilder);

    if (findQueryTypeOrmOrQueryBuilder instanceof QueryBuilder) {
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
