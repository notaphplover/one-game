import { SeedOptions } from '../models/SeedOptions';

export interface Seeder {
  seed(options?: SeedOptions): Promise<void>;
}
