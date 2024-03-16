export interface TransactionWrapper extends AsyncDisposable {
  rollback(): Promise<void>;
  tryCommit(): Promise<void>;
  unwrap(): unknown;
}
