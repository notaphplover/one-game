import { ObjectLiteral, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { SeedOptions } from '../models/SeedOptions';
import { Seeder } from './Seeder';

export abstract class BaseSeeder<TEntity extends ObjectLiteral>
  implements Seeder
{
  readonly #repository: Repository<TEntity>;

  constructor(repository: Repository<TEntity>) {
    this.#repository = repository;
  }

  public async seed(options?: SeedOptions): Promise<void> {
    const seeds: QueryDeepPartialEntity<TEntity>[] = this._getAppSeeds();

    if (options?.seedDummy === true) {
      seeds.push(...this._getDummySeeds());
    }

    await this.#seed(seeds);
  }

  async #seed(seeds: QueryDeepPartialEntity<TEntity>[]): Promise<void> {
    await this.#repository.upsert(seeds, {
      conflictPaths: this._getEntityDiscriminatorProperties(),
      skipUpdateIfNoValuesChanged: true,
    });
  }

  protected abstract _getAppSeeds(): QueryDeepPartialEntity<TEntity>[];
  protected abstract _getDummySeeds(): QueryDeepPartialEntity<TEntity>[];
  protected abstract _getEntityDiscriminatorProperties(): string[];
}
