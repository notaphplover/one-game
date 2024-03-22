import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  FindManyOptions,
  ObjectLiteral,
  QueryBuilder,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { TransactionWrapper } from '../../../application/models/TransactionWrapper';
import { FindQueryTypeOrmFromQueryBuilder } from '../builders/FindQueryTypeOrmFromQueryBuilder';
import { FindQueryTypeOrmFromQueryWithQueryBuilderBuilder } from '../builders/FindQueryTypeOrmFromQueryWithQueryBuilderBuilder';
import { isQueryBuilder } from '../utils/isQueryBuilder';
import { unwrapTypeOrmTransaction } from '../utils/unwrapTypeOrmTransaction';

export class FindTypeOrmService<
  TModel,
  TModelDb extends ObjectLiteral,
  TQuery,
> {
  readonly #repository: Repository<TModelDb>;
  readonly #modelFromModelDbBuilder:
    | Builder<TModel, [TModelDb]>
    | BuilderAsync<TModel, [TModelDb]>;
  readonly #findQueryTypeOrmFromQueryBuilder: FindQueryTypeOrmFromQueryBuilder<
    TModelDb,
    TQuery
  >;

  constructor(
    repository: Repository<TModelDb>,
    modelFromModelDbBuilder:
      | Builder<TModel, [TModelDb]>
      | BuilderAsync<TModel, [TModelDb]>,
    findQueryTypeOrmFromQueryBuilder: FindQueryTypeOrmFromQueryBuilder<
      TModelDb,
      TQuery
    >,
  ) {
    this.#repository = repository;
    this.#modelFromModelDbBuilder = modelFromModelDbBuilder;
    this.#findQueryTypeOrmFromQueryBuilder = findQueryTypeOrmFromQueryBuilder;
  }

  public async find(
    query: TQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<TModel[]> {
    const modelsDb: TModelDb[] = await this.#innerFind(
      query,
      async (queryBuilder: SelectQueryBuilder<TModelDb>): Promise<TModelDb[]> =>
        queryBuilder.getMany(),
      async (
        queryBuilder: SelectQueryBuilder<TModelDb>,
        findManyOptions: FindManyOptions<TModelDb>,
      ): Promise<TModelDb[]> =>
        queryBuilder
          .setFindOptions({ ...findManyOptions, loadEagerRelations: true })
          .getMany(),
      transactionWrapper,
    );

    const models: TModel[] = await Promise.all(
      modelsDb.map(async (modelDb: TModelDb) =>
        this.#modelFromModelDbBuilder.build(modelDb),
      ),
    );

    return models;
  }

  public async findOne(
    query: TQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<TModel | undefined> {
    const modelDb: TModelDb | undefined = await this.#innerFind(
      query,
      async (
        queryBuilder: SelectQueryBuilder<TModelDb>,
      ): Promise<TModelDb | undefined> =>
        (await queryBuilder.getOne()) ?? undefined,
      async (
        queryBuilder: SelectQueryBuilder<TModelDb>,
        findManyOptions: FindManyOptions<TModelDb>,
      ): Promise<TModelDb | undefined> =>
        (await queryBuilder
          .setFindOptions({
            ...findManyOptions,
            loadEagerRelations: true,
          })
          .getOne()) ?? undefined,
      transactionWrapper,
    );

    let model: TModel | undefined;

    if (modelDb !== undefined) {
      model = await this.#modelFromModelDbBuilder.build(modelDb);
    }

    return model;
  }

  async #innerFind<TOutputDb extends undefined | TModelDb | TModelDb[]>(
    query: TQuery,
    findByQueryBuilder: (
      queryBuilder: SelectQueryBuilder<TModelDb>,
    ) => Promise<TOutputDb>,
    findByFindManyOptions: (
      queryBuilder: SelectQueryBuilder<TModelDb>,
      findManyOptions: FindManyOptions<TModelDb>,
    ) => Promise<TOutputDb>,
    transactionWrapper: TransactionWrapper | undefined,
  ): Promise<TOutputDb> {
    const queryRunner: QueryRunner | undefined =
      unwrapTypeOrmTransaction(transactionWrapper);

    const selectQueryBuilder: SelectQueryBuilder<TModelDb> =
      this.#repository.createQueryBuilder(
        this.#repository.metadata.name,
        queryRunner,
      );

    const findQueryTypeOrmOrQueryBuilder:
      | FindManyOptions<TModelDb>
      | QueryBuilder<TModelDb> = await (
      this
        .#findQueryTypeOrmFromQueryBuilder as FindQueryTypeOrmFromQueryWithQueryBuilderBuilder<
        TModelDb,
        TQuery
      >
    ).build(query, selectQueryBuilder);

    let outputDb: TOutputDb;

    if (isQueryBuilder<TModelDb>(findQueryTypeOrmOrQueryBuilder)) {
      outputDb = await findByQueryBuilder(
        findQueryTypeOrmOrQueryBuilder as SelectQueryBuilder<TModelDb>,
      );
    } else {
      outputDb = await findByFindManyOptions(
        selectQueryBuilder,
        findQueryTypeOrmOrQueryBuilder,
      );
    }

    return outputDb;
  }
}
