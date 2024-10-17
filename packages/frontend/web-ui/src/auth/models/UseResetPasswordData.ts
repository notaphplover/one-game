import { UseResetPasswordStatus } from './UseResetPasswordStatus';

export interface ResetPasswordFormFields {
  confirmPassword: string;
  password: string;
}

export interface ResetPasswordFormValidationResult {
  confirmPassword?: string;
  password?: string;
}

export interface UseResetPasswordData {
  form: {
    errorMessage?: string;
    fields: ResetPasswordFormFields;
    validation: ResetPasswordFormValidationResult;
  };
  status: UseResetPasswordStatus;
}
