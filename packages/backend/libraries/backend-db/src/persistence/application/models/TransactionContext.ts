export interface TransactionContext extends AsyncDisposable {
  unwrap(): unknown;
}
