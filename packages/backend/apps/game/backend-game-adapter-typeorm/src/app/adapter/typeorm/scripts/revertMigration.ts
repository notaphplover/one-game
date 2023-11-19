import { DataSource, DataSourceOptions, MigrationExecutor } from 'typeorm';

import { provideTypeOrmDataSource } from './provideTypeOrmDatasource';

export async function revertMigration(
  dataSourceOptions: DataSourceOptions,
): Promise<void> {
  const datasource: DataSource =
    await provideTypeOrmDataSource(dataSourceOptions);

  await datasource.initialize();

  try {
    const migrationExecutor: MigrationExecutor = new MigrationExecutor(
      datasource,
    );

    await migrationExecutor.undoLastMigration();
  } finally {
    await datasource.destroy();
  }
}
