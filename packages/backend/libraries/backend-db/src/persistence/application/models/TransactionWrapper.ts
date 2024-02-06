export interface TransactionWrapper {
  rollback(): Promise<void>;
  tryCommit(): Promise<void>;
  unwrap(): unknown;
}
