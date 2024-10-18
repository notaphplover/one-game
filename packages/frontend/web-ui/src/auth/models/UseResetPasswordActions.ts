export interface UseResetPasswordActions {
  handlers: {
    onPasswordChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirmPasswordChanged: (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    onSubmit: (event: React.FormEvent) => void;
  };
}
