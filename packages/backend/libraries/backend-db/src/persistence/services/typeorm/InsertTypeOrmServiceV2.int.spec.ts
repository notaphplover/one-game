import path from 'path';

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BuilderAsync } from '@cornie-js/backend-common';
import {
  Column,
  ColumnType,
  DataSource,
  DataSourceOptions,
  Entity,
  PrimaryColumn,
  QueryRunner,
  Repository,
  Table,
  TableColumn,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { InsertTypeOrmServiceV2 } from './InsertTypeOrmServiceV2';

function getModelTestTable(fooColumnName: string, idColumnName: string): Table {
  const modelTestTableName: string = 'model_test';

  const modelTestTable: Table = new Table({
    columns: [
      {
        isPrimary: false,
        length: '128',
        name: fooColumnName,
        type: 'varchar',
      },
      {
        isPrimary: true,
        length: '36',
        name: idColumnName,
        type: 'varchar',
      },
    ],
    name: modelTestTableName,
  });

  return modelTestTable;
}

async function setupModelTestTable(
  queryRunner: QueryRunner,
  modelTestTable: Table,
): Promise<void> {
  await tearDownModelTestTable(queryRunner, modelTestTable);

  await queryRunner.createTable(modelTestTable);
}

async function tearDownModelTestTable(
  queryRunner: QueryRunner,
  modelTestTable: Table,
): Promise<void> {
  if (await queryRunner.hasTable(modelTestTable)) {
    await queryRunner.dropTable(modelTestTable);
  }
}

function decorateModelTest(
  modelTestTable: Table,
  fooColumnName: keyof ModelTest,
  idColumnName: keyof ModelTest,
): void {
  const idColumn: TableColumn = modelTestTable.columns.find(
    (tableColumn: TableColumn) => tableColumn.name === idColumnName,
  ) as TableColumn;
  const fooColumn: TableColumn = modelTestTable.columns.find(
    (tableColumn: TableColumn) => tableColumn.name === fooColumnName,
  ) as TableColumn;

  PrimaryColumn({
    length: idColumn.length,
    name: idColumn.name,
    type: idColumn.type as ColumnType,
  })(ModelTest.prototype, idColumn.name);

  Column({
    length: fooColumn.length,
    name: fooColumn.name,
    type: fooColumn.type as ColumnType,
  })(ModelTest.prototype, fooColumn.name);

  Entity(modelTestTable.name)(ModelTest);
}

class ModelTest {
  public id!: string;
  public foo!: string;
}

interface QueryTest {
  fooValue: string;
}

describe(InsertTypeOrmServiceV2.name, () => {
  let modelTestTable: Table;
  let datasource: DataSource;
  let queryRunner: QueryRunner;

  let modelTestRepository: Repository<ModelTest>;
  let setQueryTypeOrmFromSetQueryBuilderMock: jest.Mocked<
    BuilderAsync<
      QueryDeepPartialEntity<ModelTest> | QueryDeepPartialEntity<ModelTest>[],
      [QueryTest]
    >
  >;
  let modelFromModelDbBuilderMock: jest.Mocked<
    BuilderAsync<ModelTest, [ModelTest]>
  >;

  let insertTypeOrmServiceV2: InsertTypeOrmServiceV2<
    ModelTest,
    ModelTest,
    QueryTest
  >;

  beforeAll(async () => {
    const fooColumnName: keyof ModelTest = 'foo';
    const idColumnName: keyof ModelTest = 'id';

    modelTestTable = getModelTestTable(fooColumnName, idColumnName);

    decorateModelTest(modelTestTable, fooColumnName, idColumnName);

    const datasourceOptions: DataSourceOptions = {
      database: path.resolve('tmp', 'typeorm', 'InsertTypeOrmServiceV2.sqlite'),
      entities: [ModelTest],
      logging: false,
      type: 'sqlite',
    };

    datasource = new DataSource(datasourceOptions);

    await datasource.initialize();

    queryRunner = datasource.createQueryRunner();

    await setupModelTestTable(queryRunner, modelTestTable);

    modelTestRepository = datasource.getRepository(ModelTest);
    setQueryTypeOrmFromSetQueryBuilderMock = {
      build: jest.fn(),
    };
    modelFromModelDbBuilderMock = {
      build: jest.fn(),
    };

    insertTypeOrmServiceV2 = new InsertTypeOrmServiceV2<
      ModelTest,
      ModelTest,
      QueryTest
    >(
      modelTestRepository,
      modelFromModelDbBuilderMock,
      setQueryTypeOrmFromSetQueryBuilderMock,
    );
  });

  afterAll(async () => {
    await tearDownModelTestTable(queryRunner, modelTestTable);

    await datasource.destroy();
  });

  describe('.insertOne', () => {
    describe('when called', () => {
      let modelTest: ModelTest;
      let result: unknown;

      beforeAll(async () => {
        modelTest = new ModelTest();
        modelTest.id = '836d2558-0f11-4c63-beb9-e78edba50428';
        modelTest.foo = 'some foo value';

        const queryTest: QueryTest = {
          fooValue: 'blah',
        };

        const queryTypeOrmFixture: QueryDeepPartialEntity<ModelTest> = {
          foo: modelTest.foo,
          id: modelTest.id,
        };

        setQueryTypeOrmFromSetQueryBuilderMock.build.mockResolvedValueOnce(
          queryTypeOrmFixture,
        );

        modelFromModelDbBuilderMock.build.mockImplementationOnce(
          async (modelTest: ModelTest) => modelTest,
        );

        result = await insertTypeOrmServiceV2.insertOne(queryTest);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return a model', () => {
        expect(result).toStrictEqual(modelTest);
      });
    });
  });
});
