import { Either } from '../../common/models/Either';
import { CreateNewGameStatus } from './CreateNewGameStatus';
import { FormFieldsNewGame } from './FormFieldsNewGame';
import { FormNewGameValidationErrorResult } from './FormNewGameValidationErrorResult';

export interface CreateNewGameResult {
  formFields: FormFieldsNewGame;
  status: CreateNewGameStatus;
  notifyFormFieldsFilled: () => void;
  formValidation: Either<FormNewGameValidationErrorResult, undefined>;
  errorMessage: string | null;
  setFormFieldIsPublic: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    checked: boolean,
  ) => void;
  setFormFieldName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setFormFieldPlayers: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setFormFieldOptions: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
