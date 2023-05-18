import { Inject, Injectable } from '@nestjs/common';

import { SeedOptions } from '../../../seeder/application/models/SeedOptions';
import { Seeder } from '../../../seeder/application/modules/Seeder';
import { seedersSymbol } from '../models/seedersSymbol';

@Injectable()
export class PipelineSeeder implements Seeder {
  readonly #seeders: Seeder[];

  constructor(
    @Inject(seedersSymbol)
    seeders: Seeder[],
  ) {
    this.#seeders = seeders;
  }

  public async seed(options?: SeedOptions): Promise<void> {
    for (const seeder of this.#seeders) {
      await seeder.seed(options);
    }
  }
}
