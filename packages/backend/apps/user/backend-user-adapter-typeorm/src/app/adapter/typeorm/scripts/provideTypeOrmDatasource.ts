import { DataSource, DataSourceOptions } from 'typeorm';

import { typeOrmEntities } from '../../../../foundation/db/adapter/nest/models/entities';
import { typeOrmMigrationFolders } from '../../../../foundation/db/adapter/nest/models/migrationFolders';

export async function provideTypeOrmDataSource(
  dataSourceOptions: DataSourceOptions,
): Promise<DataSource> {
  return new DataSource({
    ...dataSourceOptions,
    entities: typeOrmEntities,
    migrations: typeOrmMigrationFolders,
  });
}
