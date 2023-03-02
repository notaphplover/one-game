import path from 'path';

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ConverterAsync } from '@one-game-js/backend-common';
import {
  Column,
  ColumnType,
  DataSource,
  DataSourceOptions,
  Entity,
  FindManyOptions,
  Not,
  PrimaryColumn,
  QueryRunner,
  Repository,
  Table,
  TableColumn,
} from 'typeorm';

import { QueryToFindQueryTypeOrmConverter } from '../../converters/typeorm/QueryToFindQueryTypeOrmConverter';
import { FindTypeOrmService } from './FindTypeOrmService';

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

describe(FindTypeOrmService.name, () => {
  let modelTestTable: Table;
  let datasource: DataSource;
  let queryRunner: QueryRunner;

  let modelTestRepository: Repository<ModelTest>;
  let findQueryToFindQueryTypeOrmConverterMock: jest.Mocked<
    QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>
  >;
  let modelDbToModelConverter: jest.Mocked<
    ConverterAsync<ModelTest, ModelTest>
  >;

  let findTypeOrmService: FindTypeOrmService<ModelTest, ModelTest, QueryTest>;

  beforeAll(async () => {
    const fooColumnName: keyof ModelTest = 'foo';
    const idColumnName: keyof ModelTest = 'id';

    modelTestTable = getModelTestTable(fooColumnName, idColumnName);

    decorateModelTest(modelTestTable, fooColumnName, idColumnName);

    const datasourceOptions: DataSourceOptions = {
      database: path.resolve('tmp', 'typeorm', 'FindTypeOrmService.sqlite'),
      entities: [ModelTest],
      logging: false,
      type: 'sqlite',
    };

    datasource = new DataSource(datasourceOptions);

    await datasource.initialize();

    queryRunner = datasource.createQueryRunner();

    await setupModelTestTable(queryRunner, modelTestTable);

    modelTestRepository = datasource.getRepository(ModelTest);
    findQueryToFindQueryTypeOrmConverterMock = {
      convert: jest.fn(),
    } as unknown as jest.Mocked<
      QueryToFindQueryTypeOrmConverter<ModelTest, QueryTest>
    >;
    modelDbToModelConverter = {
      convert: jest.fn(),
    };

    findTypeOrmService = new FindTypeOrmService<
      ModelTest,
      ModelTest,
      QueryTest
    >(
      modelTestRepository,
      modelDbToModelConverter,
      findQueryToFindQueryTypeOrmConverterMock,
    );
  });

  afterAll(async () => {
    await tearDownModelTestTable(queryRunner, modelTestTable);

    await datasource.destroy();
  });

  describe('having a ModelTest on db', () => {
    let modelTest: ModelTest;

    beforeAll(async () => {
      modelTest = new ModelTest();
      modelTest.id = '836d2558-0f11-4c63-beb9-e78edba50428';
      modelTest.foo = 'some foo value';

      await modelTestRepository.save(modelTest);
    });

    describe('.findOne', () => {
      describe('when called, and findQueryToFindQueryTypeOrmConverter.convert returns a typeorm find query matching a ModelTest', () => {
        let result: unknown;

        beforeAll(async () => {
          const queryTest: QueryTest = {
            fooValue: 'blah',
          };

          const queryTypeOrmFixture: FindManyOptions<ModelTest> = {
            where: {
              id: modelTest.id,
            },
          };

          (
            findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
              (query: QueryTest) => Promise<FindManyOptions<ModelTest>>
            >
          ).mockResolvedValueOnce(queryTypeOrmFixture);

          modelDbToModelConverter.convert.mockImplementationOnce(
            async (modelTest: ModelTest) => modelTest,
          );

          result = await findTypeOrmService.findOne(queryTest);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a model', () => {
          expect(result).toStrictEqual(modelTest);
        });
      });

      describe('when called, and findQueryToFindQueryTypeOrmConverter.convert returns a typeorm find query not matching a ModelTest', () => {
        let result: unknown;

        beforeAll(async () => {
          const queryTest: QueryTest = {
            fooValue: 'blah',
          };

          const queryTypeOrmFixture: FindManyOptions<ModelTest> = {
            where: {
              id: Not(modelTest.id),
            },
          };

          (
            findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
              (query: QueryTest) => Promise<FindManyOptions<ModelTest>>
            >
          ).mockResolvedValueOnce(queryTypeOrmFixture);

          result = await findTypeOrmService.findOne(queryTest);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('.find', () => {
      describe('when called, and findQueryToFindQueryTypeOrmConverter.convert returns a typeorm find query matching a ModelTest', () => {
        let result: unknown;

        beforeAll(async () => {
          const queryTest: QueryTest = {
            fooValue: 'blah',
          };

          const queryTypeOrmFixture: FindManyOptions<ModelTest> = {
            where: {
              id: modelTest.id,
            },
          };

          (
            findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
              (query: QueryTest) => Promise<FindManyOptions<ModelTest>>
            >
          ).mockResolvedValueOnce(queryTypeOrmFixture);

          modelDbToModelConverter.convert.mockImplementationOnce(
            async (modelTest: ModelTest) => modelTest,
          );

          result = await findTypeOrmService.find(queryTest);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a model', () => {
          expect(result).toStrictEqual([modelTest]);
        });
      });

      describe('when called, and findQueryToFindQueryTypeOrmConverter.convert returns a typeorm find query not matching a ModelTest', () => {
        let result: unknown;

        beforeAll(async () => {
          const queryTest: QueryTest = {
            fooValue: 'blah',
          };

          const queryTypeOrmFixture: FindManyOptions<ModelTest> = {
            where: {
              id: Not(modelTest.id),
            },
          };

          (
            findQueryToFindQueryTypeOrmConverterMock.convert as jest.Mock<
              (query: QueryTest) => Promise<FindManyOptions<ModelTest>>
            >
          ).mockResolvedValueOnce(queryTypeOrmFixture);

          result = await findTypeOrmService.find(queryTest);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return an empty array', () => {
          expect(result).toStrictEqual([]);
        });
      });
    });
  });
});
