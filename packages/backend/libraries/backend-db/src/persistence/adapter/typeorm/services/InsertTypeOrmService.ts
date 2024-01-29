import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  Repository,
  InsertResult,
  ObjectLiteral,
  FindManyOptions,
  InsertQueryBuilder,
  QueryRunner,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class InsertTypeOrmService<
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

  public async insertOne(
    query: TQuery,
    queryRunner?: QueryRunner | undefined,
  ): Promise<TModel> {
    const insertQueryBuilder: InsertQueryBuilder<TModelDb> =
      this.#createInsertQueryBuilder(queryRunner);

    const insertQueryTypeOrm:
      | QueryDeepPartialEntity<TModelDb>
      | QueryDeepPartialEntity<TModelDb>[] =
      await this.#setQueryTypeOrmFromSetQueryBuilder.build(query);

    const singleInsertQueryTypeOrm: QueryDeepPartialEntity<TModelDb> =
      this.#buildSingleInsertQueryTypeOrm(insertQueryTypeOrm);

    const insertResult: InsertResult = await insertQueryBuilder
      .values(singleInsertQueryTypeOrm)
      .execute();

    const ids: ObjectLiteral[] = insertResult.identifiers;

    const [modelDb]: [TModelDb] = (await this.#findEntitiesByIds(ids)) as [
      TModelDb,
    ];

    const model: TModel = await this.#modelFromModelDbBuilder.build(modelDb);

    return model;
  }

  public async insertMany(
    query: TQuery,
    queryRunner?: QueryRunner | undefined,
  ): Promise<TModel[]> {
    const insertQueryBuilder: InsertQueryBuilder<TModelDb> =
      this.#createInsertQueryBuilder(queryRunner);

    const insertQueryTypeOrm:
      | QueryDeepPartialEntity<TModelDb>
      | QueryDeepPartialEntity<TModelDb>[] =
      await this.#setQueryTypeOrmFromSetQueryBuilder.build(query);

    const multipleInsertQueryTypeOrm: QueryDeepPartialEntity<TModelDb>[] =
      this.#buildMultipleInsertQueryTypeOrm(insertQueryTypeOrm);

    const insertResult: InsertResult = await insertQueryBuilder
      .values(multipleInsertQueryTypeOrm)
      .execute();

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

  #buildMultipleInsertQueryTypeOrm(
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

  #buildSingleInsertQueryTypeOrm(
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

  #createInsertQueryBuilder(
    queryRunner: QueryRunner | undefined,
  ): InsertQueryBuilder<TModelDb> {
    return this.#repository.createQueryBuilder(undefined, queryRunner).insert();
  }

  async #findEntitiesByIds(ids: ObjectLiteral[]): Promise<TModelDb[]> {
    const findManyOptions: FindManyOptions = {
      where: ids,
    };

    const modelDbs: TModelDb[] = await this.#repository.find(findManyOptions);

    return modelDbs;
  }
}
