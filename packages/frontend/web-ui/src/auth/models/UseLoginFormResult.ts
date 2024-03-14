import { LoginStatus } from './LoginStatus';

export interface UseLoginFormParams {
  email: string;
  password: string;
}

export interface FormValidationResult {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export type FormFieldsApp = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export interface UseLoginFormResult {
  backendError: string | null;
  formFields: FormFieldsApp;
  formStatus: LoginStatus;
  formValidation: FormValidationResult;
  notifyFormFieldsFilled: () => void;
  setFormField: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
