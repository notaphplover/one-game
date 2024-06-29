export interface UseUserInfoActions {
  handlers: {
    onConfirmPasswordChanged: (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    onNameChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event: React.FormEvent) => void;
  };
}
