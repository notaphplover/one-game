import { TransactionWrapper } from '@cornie-js/backend-db/application';

export const transactionProvisionOutputPortSymbol: symbol = Symbol.for(
  'TransactionProvisionOutputPort',
);

export interface TransactionProvisionOutputPort {
  provide(): Promise<TransactionWrapper>;
}
