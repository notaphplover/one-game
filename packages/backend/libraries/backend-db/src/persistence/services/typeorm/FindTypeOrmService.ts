import { Converter, ConverterAsync } from '@one-game-js/backend-common';
import {
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  QueryBuilder,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { QueryToFindQueryTypeOrmConverter } from '../../converters/typeorm/QueryToFindQueryTypeOrmConverter';
import { QueryWithQueryBuilderToFindQueryTypeOrmConverter } from '../../converters/typeorm/QueryWithQueryBuilderToFindQueryTypeOrmConverter';

export class FindTypeOrmService<
  TModel,
  TModelDb extends ObjectLiteral,
  TQuery,
> {
  readonly #repository: Repository<TModelDb>;
  readonly #modelDbToModelConverter:
    | Converter<TModelDb, TModel>
    | ConverterAsync<TModelDb, TModel>;
  readonly #queryToQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
    TModelDb,
    TQuery
  >;

  constructor(
    repository: Repository<TModelDb>,
    modelDbToModelConverter:
      | Converter<TModelDb, TModel>
      | ConverterAsync<TModelDb, TModel>,
    queryToQueryTypeOrmConverter: QueryToFindQueryTypeOrmConverter<
      TModelDb,
      TQuery
    >,
  ) {
    this.#repository = repository;
    this.#modelDbToModelConverter = modelDbToModelConverter;
    this.#queryToQueryTypeOrmConverter = queryToQueryTypeOrmConverter;
  }

  public async find(query: TQuery): Promise<TModel[]> {
    const modelsDb: TModelDb[] = await this.innerFind(
      query,
      async (queryBuilder: SelectQueryBuilder<TModelDb>): Promise<TModelDb[]> =>
        queryBuilder.getMany(),
      async (findManyOptions: FindManyOptions<TModelDb>): Promise<TModelDb[]> =>
        this.#repository.find(findManyOptions),
    );

    const models: TModel[] = await Promise.all(
      modelsDb.map(async (modelDb: TModelDb) =>
        this.#modelDbToModelConverter.convert(modelDb),
      ),
    );

    return models;
  }

  public async findOne(query: TQuery): Promise<TModel | undefined> {
    const modelDb: TModelDb | undefined = await this.innerFind(
      query,
      async (
        queryBuilder: SelectQueryBuilder<TModelDb>,
      ): Promise<TModelDb | undefined> =>
        (await queryBuilder.getOne()) ?? undefined,
      async (
        findConditions: FindManyOptions<TModelDb>,
      ): Promise<TModelDb | undefined> =>
        (await this.#repository.findOne(
          this.convertToFindOneOptions(findConditions),
        )) ?? undefined,
    );

    let model: TModel | undefined;

    if (modelDb === undefined) {
      model = undefined;
    } else {
      model = await this.#modelDbToModelConverter.convert(modelDb);
    }

    return model;
  }

  private convertToFindOneOptions(
    findManyOptions: FindManyOptions<TModelDb>,
  ): FindOneOptions<TModelDb> {
    return findManyOptions;
  }

  private async innerFind<TOutputDb extends undefined | TModelDb | TModelDb[]>(
    query: TQuery,
    findByQueryBuilder: (
      queryBuilder: SelectQueryBuilder<TModelDb>,
    ) => Promise<TOutputDb>,
    findByFindManyOptions: (
      findManyOptions: FindManyOptions<TModelDb>,
    ) => Promise<TOutputDb>,
  ): Promise<TOutputDb> {
    const selectQueryBuilder: SelectQueryBuilder<TModelDb> =
      this.#repository.createQueryBuilder();

    const findQueryTypeOrmOrQueryBuilder:
      | FindManyOptions<TModelDb>
      | QueryBuilder<TModelDb> = await (
      this
        .#queryToQueryTypeOrmConverter as QueryWithQueryBuilderToFindQueryTypeOrmConverter<
        TModelDb,
        TQuery
      >
    ).convert(query, selectQueryBuilder);

    let outputDb: TOutputDb;

    if (findQueryTypeOrmOrQueryBuilder instanceof QueryBuilder) {
      outputDb = await findByQueryBuilder(
        findQueryTypeOrmOrQueryBuilder as SelectQueryBuilder<TModelDb>,
      );
    } else {
      outputDb = await findByFindManyOptions(findQueryTypeOrmOrQueryBuilder);
    }

    return outputDb;
  }
}
