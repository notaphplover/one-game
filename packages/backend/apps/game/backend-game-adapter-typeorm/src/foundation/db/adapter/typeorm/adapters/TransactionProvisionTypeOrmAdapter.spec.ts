import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@cornie-js/backend-db/adapter/typeorm');

import { TypeOrmTransactionWrapper } from '@cornie-js/backend-db/adapter/typeorm';
import { DataSource } from 'typeorm';

import { TransactionProvisionTypeOrmAdapter } from './TransactionProvisionTypeOrmAdapter';

describe(TransactionProvisionTypeOrmAdapter.name, () => {
  let dataSourceFixture: DataSource;

  let transactionProvisionTypeOrmAdapter: TransactionProvisionTypeOrmAdapter;

  beforeAll(() => {
    dataSourceFixture = Symbol() as unknown as DataSource;

    transactionProvisionTypeOrmAdapter = new TransactionProvisionTypeOrmAdapter(
      dataSourceFixture,
    );
  });

  describe('.provide', () => {
    describe('when called', () => {
      let typeOrmTransactionWrapperFixture: TypeOrmTransactionWrapper;

      let result: unknown;

      beforeAll(async () => {
        typeOrmTransactionWrapperFixture =
          Symbol() as unknown as TypeOrmTransactionWrapper;

        (
          TypeOrmTransactionWrapper.build as jest.Mock<
            typeof TypeOrmTransactionWrapper.build
          >
        ).mockResolvedValueOnce(typeOrmTransactionWrapperFixture);

        result = await transactionProvisionTypeOrmAdapter.provide();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call new TypeOrmTransactionWrapper.build()', () => {
        expect(TypeOrmTransactionWrapper.build).toHaveBeenCalledTimes(1);
        expect(TypeOrmTransactionWrapper.build).toHaveBeenCalledWith(
          dataSourceFixture,
        );
      });

      it('should return a TypeOrmTransactionWrapper', () => {
        expect(result).toBe(typeOrmTransactionWrapperFixture);
      });
    });
  });
});
