import { generateMigrationQueries } from './app/adapter/typeorm/scripts/generateMigrationQueries';
import { provideTypeOrmDataSource } from './app/adapter/typeorm/scripts/provideTypeOrmDatasource';
import { revertMigration } from './app/adapter/typeorm/scripts/revertMigration';
import { runMigrations } from './app/adapter/typeorm/scripts/runMigrations';
import { DbModuleOptions } from './foundation/db/adapter/nest/models/DbModuleOptions';
import { UserDbModule } from './users/adapter/nest/UserDbModule';

export type { DbModuleOptions };

export {
  generateMigrationQueries,
  provideTypeOrmDataSource,
  revertMigration,
  runMigrations,
  UserDbModule,
};
