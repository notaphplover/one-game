import { CreateNewGameStatus } from './CreateNewGameStatus';
import { FormFieldsNewGame } from './FormFieldsNewGame';
import { FormValidationNewGameResult } from './FormValidationNewGameResult';
import { GameOptions } from './GameOptions';

export interface CreateNewGameResult {
  formFields: FormFieldsNewGame;
  gameOptions: GameOptions;
  status: CreateNewGameStatus;
  setNewGameOptions: (event: React.ChangeEvent<HTMLInputElement>) => void;
  notifyFormFieldsFilled: () => void;
  formValidation: FormValidationNewGameResult;
  backendError: string | null;
  setFormField: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
