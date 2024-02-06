import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { QueryRunner } from 'typeorm';

import { TransactionWrapper } from '../../../application/models/TransactionWrapper';
import { TypeOrmTransactionWrapper } from '../models/TypeOrmTransactionWrapper';

export function unwrapTypeOrmTransaction(
  transactionWrapper: TransactionWrapper | undefined,
): QueryRunner | undefined {
  if (transactionWrapper === undefined) {
    return undefined;
  }

  if (!TypeOrmTransactionWrapper.is(transactionWrapper)) {
    throw new AppError(AppErrorKind.unknown, 'Unexpected transaction context');
  }

  return transactionWrapper.unwrap();
}
