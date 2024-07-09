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
    fields: RegisterFormFields;
    validation: RegisterFormValidationResult;
  };
  status: UseRegisterStatus;
}
