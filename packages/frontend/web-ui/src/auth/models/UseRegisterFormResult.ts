import { FormFieldsRegister } from './FormFieldsRegister';
import { FormValidationResult } from './FormValidationResult';
import { RegisterStatus } from './RegisterStatus';

export interface UseRegisterFormParams {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UseRegisterFormResult {
  backendError: string | null;
  formFields: FormFieldsRegister;
  formStatus: RegisterStatus;
  formValidation: FormValidationResult;
  notifyFormFieldsFilled: () => void;
  setFormField: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
