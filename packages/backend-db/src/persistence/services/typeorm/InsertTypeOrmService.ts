import { ConverterAsync } from '@one-game-js/backend-common';
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
  readonly #modelDbToModelConverter: ConverterAsync<TModelDb, TModel>;
  readonly #setQueryToSetTypeOrmQueryConverter: ConverterAsync<
    TQuery,
    QueryDeepPartialEntity<TModelDb> | QueryDeepPartialEntity<TModelDb>[]
  >;

  constructor(
    repository: Repository<TModelDb>,
    modelDbToModelConverter: ConverterAsync<TModelDb, TModel>,
    setQueryToSetTypeOrmQueryConverter: ConverterAsync<
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
