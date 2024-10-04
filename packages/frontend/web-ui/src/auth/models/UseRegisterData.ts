import { UseRegisterStatus } from './UseRegisterStatus';

export interface RegisterFormFields {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
}

export interface RegisterFormValidationResult {
  confirmPassword?: string;
  email?: string;
  name?: string;
  password?: string;
}

export interface UseRegisterData {
  form: {
    errorMessage?: string;
    fields: RegisterFormFields;
    validation: RegisterFormValidationResult;
  };
  status: UseRegisterStatus;
}
