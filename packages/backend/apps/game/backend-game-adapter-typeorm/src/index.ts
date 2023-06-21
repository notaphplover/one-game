import { provideTypeOrmDataSource } from './app/adapter/typeorm/scripts/provideTypeOrmDatasource';
import { runMigrations } from './app/adapter/typeorm/scripts/runMigrations';
import { DbModuleOptions } from './foundation/db/adapter/nest/models/DbModuleOptions';
import { DbModule } from './foundation/db/adapter/nest/modules/DbModule';
import { GameDbModule } from './games/adapter/nest/modules/GameDbModule';

export type { DbModuleOptions };

export { DbModule, provideTypeOrmDataSource, GameDbModule, runMigrations };
