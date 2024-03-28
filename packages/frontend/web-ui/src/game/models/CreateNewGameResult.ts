import { CreateNewGameStatus } from './CreateNewGameStatus';
import { FormFieldsNewGame } from './FormFieldsNewGame';
import { FormValidationNewGameResult } from './FormValidationNewGameResult';
import { GameOptions } from './GameOptions';

export interface setFormFieldsParams {
  name: string;
  value: string | number | GameOptions;
}

export interface CreateNewGameResult {
  formFields: FormFieldsNewGame;
  status: CreateNewGameStatus;
  notifyFormFieldsFilled: () => void;
  formValidation: FormValidationNewGameResult;
  backendError: string | null;
  setFormField: (params: setFormFieldsParams) => void;
}
