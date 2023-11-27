import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  Repository,
  InsertResult,
  ObjectLiteral,
  FindManyOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class InsertTypeOrmServiceV2<
  TModel,
  TModelDb extends ObjectLiteral,
  TQuery,
> {
  readonly #repository: Repository<TModelDb>;
  readonly #modelFromModelDbBuilder:
    | Builder<TModel, [TModelDb]>
    | BuilderAsync<TModel, [TModelDb]>;
  readonly #setQueryTypeOrmFromSetQueryBuilder:
    | Builder<
        QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[],
        [TQuery]
      >
    | BuilderAsync<
        QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[],
        [TQuery]
      >;

  constructor(
    repository: Repository<TModelDb>,
    modelFromModelDbBuilder:
      | Builder<TModel, [TModelDb]>
      | BuilderAsync<TModel, [TModelDb]>,
    setQueryTypeOrmFromSetQueryBuilder:
      | Builder<
          QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[],
          [TQuery]
        >
      | BuilderAsync<
          QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[],
          [TQuery]
        >,
  ) {
    this.#repository = repository;
    this.#modelFromModelDbBuilder = modelFromModelDbBuilder;
    this.#setQueryTypeOrmFromSetQueryBuilder =
      setQueryTypeOrmFromSetQueryBuilder;
  }

  public async insertOne(query: TQuery): Promise<TModel> {
    const insertQueryTypeOrm:
      | QueryDeepPartialEntity<TModelDb>
      | QueryDeepPartialEntity<TModelDb>[] =
      await this.#setQueryTypeOrmFromSetQueryBuilder.build(query);

    const singleInsertQueryTypeOrm: QueryDeepPartialEntity<TModelDb> =
      this.#convertToSingleInsertQueryTypeOrm(insertQueryTypeOrm);

    const insertResult: InsertResult = await this.#repository.insert(
      singleInsertQueryTypeOrm,
    );

    const ids: ObjectLiteral[] = insertResult.identifiers;

    const [modelDb]: [TModelDb] = (await this.#findEntitiesByIds(ids)) as [
      TModelDb,
    ];

    const model: TModel = await this.#modelFromModelDbBuilder.build(modelDb);

    return model;
  }

  public async insertMany(query: TQuery): Promise<TModel[]> {
    const insertQueryTypeOrm:
      | QueryDeepPartialEntity<TModelDb>
      | QueryDeepPartialEntity<TModelDb>[] =
      await this.#setQueryTypeOrmFromSetQueryBuilder.build(query);

    const multipleInsertQueryTypeOrm: QueryDeepPartialEntity<TModelDb>[] =
      this.#convertToMultipleInsertQueryTypeOrm(insertQueryTypeOrm);

    const insertResult: InsertResult = await this.#repository.insert(
      multipleInsertQueryTypeOrm,
    );

    const ids: ObjectLiteral[] = insertResult.identifiers;

    const modelDbs: TModelDb[] = await this.#findEntitiesByIds(ids);

    const models: TModel[] = await Promise.all(
      modelDbs.map(
        async (modelDb: TModelDb): Promise<TModel> =>
          this.#modelFromModelDbBuilder.build(modelDb),
      ),
    );

    return models;
  }

  #convertToMultipleInsertQueryTypeOrm(
    typeOrmQuery:
      | QueryDeepPartialEntity<TModelDb>
      | QueryDeepPartialEntity<TModelDb>[],
  ): QueryDeepPartialEntity<TModelDb>[] {
    let multipleInsertQueryTypeOrm: QueryDeepPartialEntity<TModelDb>[];

    if (Array.isArray(typeOrmQuery)) {
      multipleInsertQueryTypeOrm = typeOrmQuery;
    } else {
      multipleInsertQueryTypeOrm = [typeOrmQuery];
    }

    return multipleInsertQueryTypeOrm;
  }

  #convertToSingleInsertQueryTypeOrm(
    typeOrmQuery:
      | QueryDeepPartialEntity<TModelDb>
      | QueryDeepPartialEntity<TModelDb>[],
  ): QueryDeepPartialEntity<TModelDb> {
    let singleInsertQueryTypeOrm: QueryDeepPartialEntity<TModelDb>;

    if (Array.isArray(typeOrmQuery)) {
      if (typeOrmQuery.length === 1) {
        // eslint-disable-next-line @typescript-eslint/typedef
        [singleInsertQueryTypeOrm] = typeOrmQuery as [
          QueryDeepPartialEntity<TModelDb>,
        ];
      } else {
        throw new Error(
          'Expected a single TypeORM insert query when called .insertOne()',
        );
      }
    } else {
      singleInsertQueryTypeOrm = typeOrmQuery;
    }

    return singleInsertQueryTypeOrm;
  }

  async #findEntitiesByIds(ids: ObjectLiteral[]): Promise<TModelDb[]> {
    const findManyOptions: FindManyOptions = {
      where: ids,
    };

    const modelDbs: TModelDb[] = await this.#repository.find(findManyOptions);

    return modelDbs;
  }
}
