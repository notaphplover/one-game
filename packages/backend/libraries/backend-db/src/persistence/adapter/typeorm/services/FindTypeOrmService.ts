import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { FindQueryTypeOrmFromQueryBuilder } from '../builders/FindQueryTypeOrmFromQueryBuilder';
import { FindQueryTypeOrmFromQueryWithQueryBuilderBuilder } from '../builders/FindQueryTypeOrmFromQueryWithQueryBuilderBuilder';
import { isQueryBuilder } from '../utils/isQueryBuilder';

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

  public async find(query: TQuery): Promise<TModel[]> {
    const modelsDb: TModelDb[] = await this.#innerFind(
      query,
      async (queryBuilder: SelectQueryBuilder<TModelDb>): Promise<TModelDb[]> =>
        queryBuilder.getMany(),
      async (findManyOptions: FindManyOptions<TModelDb>): Promise<TModelDb[]> =>
        this.#repository.find(findManyOptions),
    );

    const models: TModel[] = await Promise.all(
      modelsDb.map(async (modelDb: TModelDb) =>
        this.#modelFromModelDbBuilder.build(modelDb),
      ),
    );

    return models;
  }

  public async findOne(query: TQuery): Promise<TModel | undefined> {
    const modelDb: TModelDb | undefined = await this.#innerFind(
      query,
      async (
        queryBuilder: SelectQueryBuilder<TModelDb>,
      ): Promise<TModelDb | undefined> =>
        (await queryBuilder.getOne()) ?? undefined,
      async (
        findConditions: FindManyOptions<TModelDb>,
      ): Promise<TModelDb | undefined> =>
        (await this.#repository.findOne(
          this.#buildFindOneOptions(findConditions),
        )) ?? undefined,
    );

    let model: TModel | undefined;

    if (modelDb === undefined) {
      model = undefined;
    } else {
      model = await this.#modelFromModelDbBuilder.build(modelDb);
    }

    return model;
  }

  #buildFindOneOptions(
    findManyOptions: FindManyOptions<TModelDb>,
  ): FindOneOptions<TModelDb> {
    return findManyOptions;
  }

  async #innerFind<TOutputDb extends undefined | TModelDb | TModelDb[]>(
    query: TQuery,
    findByQueryBuilder: (
      queryBuilder: SelectQueryBuilder<TModelDb>,
    ) => Promise<TOutputDb>,
    findByFindManyOptions: (
      findManyOptions: FindManyOptions<TModelDb>,
    ) => Promise<TOutputDb>,
  ): Promise<TOutputDb> {
    const selectQueryBuilder: SelectQueryBuilder<TModelDb> =
      this.#repository.createQueryBuilder(this.#repository.metadata.name);

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
      outputDb = await findByFindManyOptions(findQueryTypeOrmOrQueryBuilder);
    }

    return outputDb;
  }
}
