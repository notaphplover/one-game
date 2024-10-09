export interface UseAuthForgotActions {
  handlers: {
    onEmailChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event: React.FormEvent) => void;
  };
}
