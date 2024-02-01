import { generateMigrationQueries } from './app/adapter/typeorm/scripts/generateMigrationQueries';
import { provideTypeOrmDataSource } from './app/adapter/typeorm/scripts/provideTypeOrmDatasource';
import { revertMigration } from './app/adapter/typeorm/scripts/revertMigration';
import { runMigrations } from './app/adapter/typeorm/scripts/runMigrations';
import { DbModuleOptions } from './foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from './foundation/db/adapter/nest/modules/DbModule';
import { GameDbModule } from './games/adapter/nest/modules/GameDbModule';

export type { DbModuleOptions };

export {
  DbModule,
  GameDbModule,
  generateMigrationQueries,
  provideTypeOrmDataSource,
  revertMigration,
  runMigrations,
};
