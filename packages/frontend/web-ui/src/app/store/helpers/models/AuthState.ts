export interface AuthState {
  status: string;
  token: string | null;
  errorMessage: string | null;
}
