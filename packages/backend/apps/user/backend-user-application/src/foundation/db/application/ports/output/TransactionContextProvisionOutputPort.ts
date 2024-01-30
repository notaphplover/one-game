import { TransactionContext } from '@cornie-js/backend-db/application';

export const transactionContextProvisionOutputPortSymbol: symbol = Symbol.for(
  'TransactionContextProvisionOutputPort',
);

export interface TransactionContextProvisionOutputPort {
  provide(): Promise<TransactionContext>;
}
