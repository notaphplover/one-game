import { Builder, BuilderAsync } from '@cornie-js/backend-common';
import {
  Repository,
  InsertResult,
  ObjectLiteral,
  InsertQueryBuilder,
  QueryRunner,
  SelectQueryBuilder,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { TransactionContext } from '../../../application/models/TransactionContext';
import { unwrapTypeOrmTransactionContext } from '../utils/unwrapTypeOrmTransactionContext';

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
    transactionContext?: TransactionContext | undefined,
  ): Promise<TModel> {
    const queryRunner: QueryRunner | undefined =
      unwrapTypeOrmTransactionContext(transactionContext);

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

    const [modelDb]: [TModelDb] = (await this.#findEntitiesByIds(
      ids,
      queryRunner,
    )) as [TModelDb];

    const model: TModel = await this.#modelFromModelDbBuilder.build(modelDb);

    return model;
  }

  public async insertMany(
    query: TQuery,
    transactionContext?: TransactionContext | undefined,
  ): Promise<TModel[]> {
    const queryRunner: QueryRunner | undefined =
      unwrapTypeOrmTransactionContext(transactionContext);

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

    const modelDbs: TModelDb[] = await this.#findEntitiesByIds(
      ids,
      queryRunner,
    );

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

  async #findEntitiesByIds(
    ids: ObjectLiteral[],
    queryRunner: QueryRunner | undefined,
  ): Promise<TModelDb[]> {
    const queryBuilder: SelectQueryBuilder<TModelDb> = this.#repository
      .createQueryBuilder(undefined, queryRunner)
      .setFindOptions({
        loadEagerRelations: true,
        where: ids as FindOptionsWhere<TModelDb>[],
      });

    const modelDbs: TModelDb[] = await queryBuilder.getMany();

    return modelDbs;
  }
}
