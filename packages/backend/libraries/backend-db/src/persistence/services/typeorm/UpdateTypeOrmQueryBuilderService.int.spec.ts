import path from 'path';

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BuilderAsync } from '@cornie-js/backend-common';
import {
  Column,
  ColumnType,
  DataSource,
  DataSourceOptions,
  Entity,
  FindManyOptions,
  ObjectLiteral,
  PrimaryColumn,
  QueryBuilder,
  QueryRunner,
  Repository,
  Table,
  TableColumn,
  WhereExpressionBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { UpdateTypeOrmQueryBuilderService } from './UpdateTypeOrmQueryBuilderService';

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

describe(UpdateTypeOrmQueryBuilderService.name, () => {
  let modelTestTable: Table;
  let datasource: DataSource;
  let queryRunner: QueryRunner;

  let modelTestRepository: Repository<ModelTest>;
  let findQueryTypeOrmFromUpdateQueryBuilderMock: jest.Mocked<
    BuilderAsync<
      QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
      [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
    >
  >;
  let setQueryTypeOrmFromUpdateQueryBuilderMock: jest.Mocked<
    BuilderAsync<QueryDeepPartialEntity<ModelTest>, [QueryTest]>
  >;

  let updateTypeOrmQueryBuilderService: UpdateTypeOrmQueryBuilderService<
    ModelTest,
    QueryTest
  >;

  beforeAll(async () => {
    const fooColumnName: keyof ModelTest = 'foo';
    const idColumnName: keyof ModelTest = 'id';

    modelTestTable = getModelTestTable(fooColumnName, idColumnName);

    decorateModelTest(modelTestTable, fooColumnName, idColumnName);

    const datasourceOptions: DataSourceOptions = {
      database: path.resolve(
        'tmp',
        'typeorm',
        'UpdateTypeOrmQueryBuilderService.sqlite',
      ),
      entities: [ModelTest],
      logging: false,
      type: 'sqlite',
    };

    datasource = new DataSource(datasourceOptions);

    await datasource.initialize();

    queryRunner = datasource.createQueryRunner();

    await setupModelTestTable(queryRunner, modelTestTable);

    modelTestRepository = datasource.getRepository(ModelTest);
    findQueryTypeOrmFromUpdateQueryBuilderMock = {
      build: jest.fn(),
    } as Partial<
      BuilderAsync<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >
    > as jest.Mocked<
      BuilderAsync<
        QueryBuilder<ObjectLiteral> & WhereExpressionBuilder,
        [QueryTest, QueryBuilder<ObjectLiteral> & WhereExpressionBuilder]
      >
    >;
    setQueryTypeOrmFromUpdateQueryBuilderMock = {
      build: jest.fn(),
    };

    updateTypeOrmQueryBuilderService = new UpdateTypeOrmQueryBuilderService<
      ModelTest,
      QueryTest
    >(
      modelTestRepository,
      findQueryTypeOrmFromUpdateQueryBuilderMock,
      setQueryTypeOrmFromUpdateQueryBuilderMock,
    );
  });

  describe('.update', () => {
    describe('having a model', () => {
      let modelTest: ModelTest;

      beforeAll(() => {
        modelTest = new ModelTest();
        modelTest.id = '836d2558-0f11-4c63-beb9-e78edba50428';
        modelTest.foo = 'some foo value';
      });

      describe('when called, and model is on db and findQueryTypeOrmFromUpdateQueryBuilderMock.build returns a typeorm find query matching a ModelTest', () => {
        let setQueryTypeOrmFixture: QueryDeepPartialEntity<ModelTest>;

        beforeAll(async () => {
          await modelTestRepository.save(modelTest);

          const queryTest: QueryTest = {
            fooValue: 'blah',
          };

          setQueryTypeOrmFixture = {
            foo: 'another foo value',
          };

          findQueryTypeOrmFromUpdateQueryBuilderMock.build.mockImplementationOnce(
            async (
              _queryTest: QueryTest,
              queryBuilder: QueryBuilder<ObjectLiteral> &
                WhereExpressionBuilder,
            ): Promise<
              QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
            > => {
              return queryBuilder.andWhere('id = :id', {
                id: modelTest.id,
              });
            },
          );

          setQueryTypeOrmFromUpdateQueryBuilderMock.build.mockResolvedValueOnce(
            setQueryTypeOrmFixture,
          );

          await updateTypeOrmQueryBuilderService.update(queryTest);
        });

        afterAll(async () => {
          await modelTestRepository.delete({
            id: modelTest.id,
          });

          jest.clearAllMocks();
        });

        describe('when called and modelTestRepository.findOne() with a typeorm find query matching the ModelTest', () => {
          let result: unknown;

          beforeAll(async () => {
            const queryTypeOrmFixture: FindManyOptions<ModelTest> = {
              where: {
                id: modelTest.id,
              },
            };

            result = await modelTestRepository.findOne(queryTypeOrmFixture);
          });

          it('should return an updated model test', () => {
            const expected: ModelTest = new ModelTest();

            expected.id =
              (setQueryTypeOrmFixture.id as string | undefined) ?? modelTest.id;
            expected.foo =
              (setQueryTypeOrmFixture.foo as string | undefined) ??
              modelTest.foo;

            expect(result).toStrictEqual(expected);
          });
        });
      });

      describe('when called, and model is on db and findQueryTypeOrmFromUpdateQueryBuilderMock.build returns a typeorm find query not matching a ModelTest', () => {
        let setQueryTypeOrmFixture: QueryDeepPartialEntity<ModelTest>;

        beforeAll(async () => {
          await modelTestRepository.save(modelTest);

          const queryTest: QueryTest = {
            fooValue: 'blah',
          };

          setQueryTypeOrmFixture = {
            foo: 'another foo value',
          };

          findQueryTypeOrmFromUpdateQueryBuilderMock.build.mockImplementationOnce(
            async (
              _queryTest: QueryTest,
              queryBuilder: QueryBuilder<ObjectLiteral> &
                WhereExpressionBuilder,
            ): Promise<
              QueryBuilder<ObjectLiteral> & WhereExpressionBuilder
            > => {
              return queryBuilder.andWhere('id != :id', {
                id: modelTest.id,
              });
            },
          );

          setQueryTypeOrmFromUpdateQueryBuilderMock.build.mockResolvedValueOnce(
            setQueryTypeOrmFixture,
          );

          await updateTypeOrmQueryBuilderService.update(queryTest);
        });

        afterAll(async () => {
          await modelTestRepository.delete({
            id: modelTest.id,
          });

          jest.clearAllMocks();
        });

        describe('when called and modelTestRepository.findOne() with a typeorm find query matching the ModelTest', () => {
          let result: unknown;

          beforeAll(async () => {
            const queryTypeOrmFixture: FindManyOptions<ModelTest> = {
              where: {
                id: modelTest.id,
              },
            };

            result = await modelTestRepository.findOne(queryTypeOrmFixture);
          });

          it('should return a model test', () => {
            expect(result).toStrictEqual(modelTest);
          });
        });
      });
    });
  });
});
