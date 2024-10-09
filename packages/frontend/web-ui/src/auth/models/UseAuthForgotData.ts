import { UseAuthForgotStatus } from './UseAuthForgotStatus';

export interface AuthForgotFormFields {
  email: string;
}

export interface AuthForgotFormValidationResult {
  email?: string;
}

export interface UseAuthForgotData {
  form: {
    errorMessage?: string;
    fields: AuthForgotFormFields;
    validation: AuthForgotFormValidationResult;
  };
  status: UseAuthForgotStatus;
}
