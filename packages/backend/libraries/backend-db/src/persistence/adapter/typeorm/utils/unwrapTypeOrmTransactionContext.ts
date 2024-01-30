import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { QueryRunner } from 'typeorm';

import { TransactionContext } from '../../../application/models/TransactionContext';
import { TypeOrmTransactionContext } from '../models/TypeOrmTransactionContext';

export function unwrapTypeOrmTransactionContext(
  transactionContext: TransactionContext | undefined,
): QueryRunner | undefined {
  if (transactionContext === undefined) {
    return undefined;
  }

  if (!TypeOrmTransactionContext.is(transactionContext)) {
    throw new AppError(AppErrorKind.unknown, 'Unexpected transaction context');
  }

  return transactionContext.unwrap();
}
