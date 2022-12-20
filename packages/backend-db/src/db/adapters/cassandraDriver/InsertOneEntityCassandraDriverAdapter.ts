import { Converter, ConverterAsync } from '@one-game-js/backend-common';
import { ArrayOrObject, Client, QueryOptions, types } from 'cassandra-driver';

import { InsertOneEntityPort } from '../../application/ports/InsertOneEntityPort';

export class InsertOneEntityCassandraDriverAdapter<TQuery, TEntity>
  implements InsertOneEntityPort<TQuery, TEntity>
{
  readonly #client: Client;
  readonly #queryToQueryExecuteParametersConverter: Converter<
    TQuery,
    [string, ArrayOrObject | undefined, QueryOptions | undefined]
  >;
  readonly #rowToEntityConverter: ConverterAsync<types.Row, TEntity>;

  constructor(
    client: Client,
    queryToQueryExecuteParametersConverter: Converter<
      TQuery,
      [string, ArrayOrObject | undefined, QueryOptions | undefined]
    >,
    rowToEntityConverter: ConverterAsync<types.Row, TEntity>,
  ) {
    this.#client = client;
    this.#queryToQueryExecuteParametersConverter =
      queryToQueryExecuteParametersConverter;
    this.#rowToEntityConverter = rowToEntityConverter;
  }

  public async call(query: TQuery): Promise<TEntity> {
    const queryExecuteParams: [
      string,
      ArrayOrObject | undefined,
      QueryOptions | undefined,
    ] = this.#queryToQueryExecuteParametersConverter.convert(query);

    const result: types.ResultSet = await this.#client.execute(
      ...queryExecuteParams,
    );

    const firstResult: types.Row | null = result.first();

    if (firstResult === null) {
      throw new Error('No entity was created!');
    }

    const entity: TEntity = await this.#rowToEntityConverter.convert(
      firstResult,
    );

    return entity;
  }
}
