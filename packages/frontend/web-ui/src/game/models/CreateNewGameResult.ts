import { Either } from '../../common/models/Either';
import { CreateNewGameStatus } from './CreateNewGameStatus';
import { FormFieldsNewGame } from './FormFieldsNewGame';
import { FormNewGameValidationErrorResult } from './FormNewGameValidationErrorResult';

export interface CreateNewGameResult {
  formFields: FormFieldsNewGame;
  status: CreateNewGameStatus;
  notifyFormFieldsFilled: () => void;
  formValidation: Either<FormNewGameValidationErrorResult, undefined>;
  backendError: string | null;
  setFormField: () => void;
}
