import { generateMigrationQueries } from './app/adapter/typeorm/scripts/generateMigrationQueries';
import { provideTypeOrmDataSource } from './app/adapter/typeorm/scripts/provideTypeOrmDatasource';
import { revertMigration } from './app/adapter/typeorm/scripts/revertMigration';
import { runMigrations } from './app/adapter/typeorm/scripts/runMigrations';
import { DbModuleOptions } from './foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from './foundation/db/adapter/nest/modules/DbModule';
import { GameDbModule } from './games/adapter/nest/modules/GameDbModule';
import { GameSnapshotDbModule } from './gameSnapshots/adapter/nest/modules/GameSnapshotDbModule';

export type { DbModuleOptions };

export {
  DbModule,
  GameDbModule,
  GameSnapshotDbModule,
  generateMigrationQueries,
  provideTypeOrmDataSource,
  revertMigration,
  runMigrations,
};
