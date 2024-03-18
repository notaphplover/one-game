import { LoginStatus } from './LoginStatus';
import { FormFieldsApp } from './FormFieldsApp';
import { FormValidationResult } from './FormValidationResult';

export interface UseLoginFormParams {
  email: string;
  password: string;
}

export interface UseLoginFormResult {
  backendError: string | null;
  formFields: FormFieldsApp;
  formStatus: LoginStatus;
  formValidation: FormValidationResult;
  notifyFormFieldsFilled: () => void;
  setFormField: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
