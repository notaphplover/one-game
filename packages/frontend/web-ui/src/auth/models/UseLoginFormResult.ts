import { FormFieldsLogin } from './FormFieldsLogin';
import { FormValidationResult } from './FormValidationResult';
import { LoginStatus } from './LoginStatus';

export interface UseLoginFormParams {
  email: string;
  password: string;
}

export interface UseLoginFormResult {
  backendError: string | null;
  formFields: FormFieldsLogin;
  formStatus: LoginStatus;
  formValidation: FormValidationResult;
  notifyFormFieldsFilled: () => void;
  setFormField: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
