import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@cornie-js/backend-db/adapter/typeorm');

import { TypeOrmTransactionContext } from '@cornie-js/backend-db/adapter/typeorm';
import { DataSource } from 'typeorm';

import { TransactionContextProvisionTypeOrmAdapter } from './TransactionContextProvisionTypeOrmAdapter';

describe(TransactionContextProvisionTypeOrmAdapter.name, () => {
  let dataSourceFixture: DataSource;

  let transactionContextProvisionTypeOrmAdapter: TransactionContextProvisionTypeOrmAdapter;

  beforeAll(() => {
    dataSourceFixture = Symbol() as unknown as DataSource;

    transactionContextProvisionTypeOrmAdapter =
      new TransactionContextProvisionTypeOrmAdapter(dataSourceFixture);
  });

  describe('.provide', () => {
    describe('when called', () => {
      let typeOrmTransactionContextFixture: TypeOrmTransactionContext;

      let result: unknown;

      beforeAll(async () => {
        typeOrmTransactionContextFixture =
          Symbol() as unknown as TypeOrmTransactionContext;

        (
          TypeOrmTransactionContext.build as jest.Mock<
            typeof TypeOrmTransactionContext.build
          >
        ).mockResolvedValueOnce(typeOrmTransactionContextFixture);

        result = await transactionContextProvisionTypeOrmAdapter.provide();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call new TypeOrmTransactionContext.build()', () => {
        expect(TypeOrmTransactionContext.build).toHaveBeenCalledTimes(1);
        expect(TypeOrmTransactionContext.build).toHaveBeenCalledWith(
          dataSourceFixture,
        );
      });

      it('should return a TypeOrmTransactionContext', () => {
        expect(result).toBe(typeOrmTransactionContextFixture);
      });
    });
  });
});
