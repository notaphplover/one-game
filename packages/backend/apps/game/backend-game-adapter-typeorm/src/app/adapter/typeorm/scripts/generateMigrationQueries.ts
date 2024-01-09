import { DataSource, DataSourceOptions } from 'typeorm';
import { SqlInMemory } from 'typeorm/driver/SqlInMemory.js';

import { provideTypeOrmDataSource } from './provideTypeOrmDatasource';

export async function generateMigrationQueries(
  dataSourceOptions: DataSourceOptions,
): Promise<void> {
  const datasource: DataSource =
    await provideTypeOrmDataSource(dataSourceOptions);

  datasource.setOptions({
    dropSchema: false,
    logging: false,
    migrationsRun: false,
    synchronize: false,
  });

  await datasource.initialize();

  try {
    const { upQueries, downQueries }: SqlInMemory = await datasource.driver
      .createSchemaBuilder()
      .log();

    console.log('Up queries:');
    console.log();

    for (const query of upQueries) {
      console.log(query.query);
    }
    console.log();

    console.log('Down queries:');
    console.log();

    for (const query of downQueries) {
      console.log(query.query);
    }
    console.log();
  } finally {
    await datasource.destroy();
  }
}
