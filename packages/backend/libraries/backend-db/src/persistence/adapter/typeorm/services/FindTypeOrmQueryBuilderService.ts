import {
  AppError,
  AppErrorKind,
  Builder,
  BuilderAsync,
} from '@cornie-js/backend-common';
import {
  ObjectLiteral,
  QueryBuilder,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';

import { TransactionWrapper } from '../../../application/models/TransactionWrapper';
import { unwrapTypeOrmTransaction } from '../utils/unwrapTypeOrmTransaction';

interface CountResult {
  count: number;
}

export class FindTypeOrmQueryBuilderService<
  TModel,
  TModelDb extends ObjectLiteral,
  TQuery,
> {
  readonly #repository: Repository<TModelDb>;
  readonly #modelFromModelDbBuilder:
    | Builder<TModel, [TModelDb]>
    | BuilderAsync<TModel, [TModelDb]>;
  readonly #findQueryTypeOrmFromQueryBuilder:
    | Builder<
        QueryBuilder<TModelDb> & WhereExpressionBuilder,
        [TQuery, QueryBuilder<TModelDb> & WhereExpressionBuilder]
      >
    | BuilderAsync<
        QueryBuilder<TModelDb> & WhereExpressionBuilder,
        [TQuery, QueryBuilder<TModelDb> & WhereExpressionBuilder]
      >;

  constructor(
    repository: Repository<TModelDb>,
    modelFromModelDbBuilder:
      | Builder<TModel, [TModelDb]>
      | BuilderAsync<TModel, [TModelDb]>,
    findQueryTypeOrmFromQueryBuilder:
      | Builder<
          QueryBuilder<TModelDb> & WhereExpressionBuilder,
          [TQuery, QueryBuilder<TModelDb> & WhereExpressionBuilder]
        >
      | BuilderAsync<
          QueryBuilder<TModelDb> & WhereExpressionBuilder,
          [TQuery, QueryBuilder<TModelDb> & WhereExpressionBuilder]
        >,
  ) {
    this.#repository = repository;
    this.#modelFromModelDbBuilder = modelFromModelDbBuilder;
    this.#findQueryTypeOrmFromQueryBuilder = findQueryTypeOrmFromQueryBuilder;
  }

  public async count(
    query: TQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<number> {
    const findQueryTypeOrmOrQueryBuilder: SelectQueryBuilder<TModelDb> =
      await this.#buildSelectQueryBuilder(query, transactionWrapper);

    const countResult: CountResult | undefined =
      await findQueryTypeOrmOrQueryBuilder
        .select(['count(*) as count'])
        .getRawOne<CountResult>();

    if (countResult === undefined) {
      throw new AppError(
        AppErrorKind.unknown,
        'Expecting numeric result when counting entities, none found',
      );
    }

    return countResult.count;
  }

  public async find(
    query: TQuery,
    transactionWrapper?: TransactionWrapper | undefined,
  ): Promise<TModel[]> {
    const modelsDb: TModelDb[] = await this.#innerFind(
      query,
      async (queryBuilder: SelectQueryBuilder<TModelDb>): Promise<TModelDb[]> =>
        queryBuilder.getMany(),
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
      transactionWrapper,
    );

    let model: TModel | undefined;

    if (modelDb !== undefined) {
      model = await this.#modelFromModelDbBuilder.build(modelDb);
    }

    return model;
  }

  async #buildSelectQueryBuilder(
    query: TQuery,
    transactionWrapper: TransactionWrapper | undefined,
  ): Promise<SelectQueryBuilder<TModelDb>> {
    const queryRunner: QueryRunner | undefined =
      unwrapTypeOrmTransaction(transactionWrapper);

    const selectQueryBuilder: SelectQueryBuilder<TModelDb> =
      this.#repository.createQueryBuilder(
        this.#repository.metadata.name,
        queryRunner,
      );

    const findQueryTypeOrmOrQueryBuilder: SelectQueryBuilder<TModelDb> =
      (await this.#findQueryTypeOrmFromQueryBuilder.build(
        query,
        selectQueryBuilder,
      )) as SelectQueryBuilder<TModelDb>;

    return findQueryTypeOrmOrQueryBuilder;
  }

  async #innerFind<TOutputDb extends undefined | TModelDb | TModelDb[]>(
    query: TQuery,
    findByQueryBuilder: (
      queryBuilder: SelectQueryBuilder<TModelDb>,
    ) => Promise<TOutputDb>,
    transactionWrapper: TransactionWrapper | undefined,
  ): Promise<TOutputDb> {
    const findQueryTypeOrmOrQueryBuilder: SelectQueryBuilder<TModelDb> =
      await this.#buildSelectQueryBuilder(query, transactionWrapper);

    return findByQueryBuilder(findQueryTypeOrmOrQueryBuilder);
  }
}
