import {
  AppError,
  AppErrorKind,
  Builder,
  BuilderAsync,
} from '@cornie-js/backend-common';
import {
  FindOptionsWhere,
  InsertQueryBuilder,
  InsertResult,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { TransactionWrapper } from '../../../application/models/TransactionWrapper';
import { unwrapTypeOrmTransaction } from '../utils/unwrapTypeOrmTransaction';

export class InsertTypeOrmQueryBuilderService<
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
        InsertQueryBuilder<TModelDb>,
        [TQuery, InsertQueryBuilder<TModelDb>]
      >
    | BuilderAsync<
        InsertQueryBuilder<TModelDb>,
        [TQuery, InsertQueryBuilder<TModelDb>]
      >;

  constructor(
    repository: Repository<TModelDb>,
    modelFromModelDbBuilder:
      | Builder<TModel, [TModelDb]>
      | BuilderAsync<TModel, [TModelDb]>,
    setQueryTypeOrmFromSetQueryBuilder:
      | Builder<
          InsertQueryBuilder<TModelDb>,
          [TQuery, InsertQueryBuilder<TModelDb>]
        >
      | BuilderAsync<
          InsertQueryBuilder<TModelDb>,
          [TQuery, InsertQueryBuilder<TModelDb>]
        >,
  ) {
    this.#repository = repository;
    this.#modelFromModelDbBuilder = modelFromModelDbBuilder;
    this.#setQueryTypeOrmFromSetQueryBuilder =
      setQueryTypeOrmFromSetQueryBuilder;
  }

  public async insertOne(
    query: TQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<TModel> {
    const queryRunner: QueryRunner | undefined =
      unwrapTypeOrmTransaction(transactionWrapper);

    let insertQueryBuilder: InsertQueryBuilder<TModelDb> =
      this.#createInsertQueryBuilder(queryRunner);

    insertQueryBuilder = await this.#setQueryTypeOrmFromSetQueryBuilder.build(
      query,
      insertQueryBuilder,
    );

    this.#assertQueryBuilderHasSingleValue(insertQueryBuilder);

    const insertResult: InsertResult = await insertQueryBuilder.execute();

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
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<TModel[]> {
    const queryRunner: QueryRunner | undefined =
      unwrapTypeOrmTransaction(transactionWrapper);

    let insertQueryBuilder: InsertQueryBuilder<TModelDb> =
      this.#createInsertQueryBuilder(queryRunner);

    insertQueryBuilder = await this.#setQueryTypeOrmFromSetQueryBuilder.build(
      query,
      insertQueryBuilder,
    );

    this.#assertQueryBuilderHasValues(insertQueryBuilder);

    const insertResult: InsertResult = await insertQueryBuilder.execute();

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

  #assertQueryBuilderHasSingleValue(
    insertQueryBuilder: InsertQueryBuilder<TModelDb>,
  ): void {
    if (
      insertQueryBuilder.expressionMap.valuesSet === undefined ||
      (Array.isArray(insertQueryBuilder.expressionMap.valuesSet) &&
        insertQueryBuilder.expressionMap.valuesSet.length !== 1)
    ) {
      this.#throwErrorOnQueryBuilderWithWrongValues();
    }
  }

  #assertQueryBuilderHasValues(
    insertQueryBuilder: InsertQueryBuilder<TModelDb>,
  ): void {
    if (insertQueryBuilder.expressionMap.valuesSet === undefined) {
      this.#throwErrorOnQueryBuilderWithWrongValues();
    }
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

  #throwErrorOnQueryBuilderWithWrongValues(): never {
    throw new AppError(
      AppErrorKind.unknown,
      'Unexpected malformed insert query. Wrong number of entities to persist found',
    );
  }
}
