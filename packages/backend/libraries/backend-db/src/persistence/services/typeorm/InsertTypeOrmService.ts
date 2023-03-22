import { Converter, ConverterAsync } from '@one-game-js/backend-common';
import {
  Repository,
  InsertResult,
  ObjectLiteral,
  FindManyOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class InsertTypeOrmService<
  TModel,
  TModelDb extends ObjectLiteral,
  TQuery,
> {
  readonly #repository: Repository<TModelDb>;
  readonly #modelDbToModelConverter:
    | Converter<TModelDb, TModel>
    | ConverterAsync<TModelDb, TModel>;
  readonly #setQueryToSetTypeOrmQueryConverter:
    | Converter<
        TQuery,
        QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[]
      >
    | ConverterAsync<
        TQuery,
        QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[]
      >;

  constructor(
    repository: Repository<TModelDb>,
    modelDbToModelConverter:
      | Converter<TModelDb, TModel>
      | ConverterAsync<TModelDb, TModel>,
    setQueryToSetTypeOrmQueryConverter:
      | Converter<
          TQuery,
          QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[]
        >
      | ConverterAsync<
          TQuery,
          QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[]
        >,
  ) {
    this.#repository = repository;
    this.#modelDbToModelConverter = modelDbToModelConverter;
    this.#setQueryToSetTypeOrmQueryConverter =
      setQueryToSetTypeOrmQueryConverter;
  }

  public async insertOne(query: TQuery): Promise<TModel> {
    const insertQueryTypeOrm:
      | QueryDeepPartialEntity<TModelDb>
      | QueryDeepPartialEntity<TModelDb>[] =
      await this.#setQueryToSetTypeOrmQueryConverter.convert(query);

    const singleInsertQueryTypeOrm: QueryDeepPartialEntity<TModelDb> =
      this.#convertToSingleInsertQueryTypeOrm(insertQueryTypeOrm);

    const insertResult: InsertResult = await this.#repository.insert(
      singleInsertQueryTypeOrm,
    );

    const ids: ObjectLiteral[] = insertResult.identifiers;

    const [modelDb]: [TModelDb] = (await this.#findEntitiesByIds(ids)) as [
      TModelDb,
    ];

    const model: TModel = await this.#modelDbToModelConverter.convert(modelDb);

    return model;
  }

  public async insertMany(query: TQuery): Promise<TModel[]> {
    const insertQueryTypeOrm:
      | QueryDeepPartialEntity<TModelDb>
      | QueryDeepPartialEntity<TModelDb>[] =
      await this.#setQueryToSetTypeOrmQueryConverter.convert(query);

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
          this.#modelDbToModelConverter.convert(modelDb),
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
