import { useEffect, useState } from 'react';
import { Either } from '../../common/models/Either';
import {
  setFormFieldsParams,
  CreateNewGameResult,
} from '../models/CreateNewGameResult';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';
import { FormFieldsNewGame } from '../models/FormFieldsNewGame';
import { FormValidationNewGameResult } from '../models/FormValidationNewGameResult';
import { validateNumberOfPlayers } from '../../common/helpers/validateNumberOfPlayers';

export const useCreateNewGame = (): CreateNewGameResult => {
  const [formFields, setFormFields] = useState<FormFieldsNewGame>({
    name: '',
    players: 2,
    options: {
      chainDraw2Draw2Cards: false,
      chainDraw2Draw4Cards: false,
      chainDraw4Draw4Cards: false,
      chainDraw4Draw2Cards: false,
      playCardIsMandatory: false,
      playMultipleSameCards: false,
      playWildDraw4IfNoOtherAlternative: true,
    },
  });
  const [status, setStatus] = useState<CreateNewGameStatus>(
    CreateNewGameStatus.initial,
  );
  const [formValidation, setFormValidation] =
    useState<FormValidationNewGameResult>({});
  const [backendError, setBackendError] = useState<string | null>(null);

  const setFormField = (params: setFormFieldsParams): void => {
    if (
      status !== CreateNewGameStatus.initial &&
      status !== CreateNewGameStatus.validationKO
    ) {
      throw new Error('Unexpected form state at setFormField');
    }

    setFormFields({
      ...formFields,
      [params.name]: params.value,
    });
  };

  const notifyFormFieldsFilled = (): void => {
    setStatus(CreateNewGameStatus.pendingValidation);
    setBackendError(null);
  };

  useEffect(() => {
    switch (status) {
      case CreateNewGameStatus.pendingValidation:
        validateForm();
        break;
      case CreateNewGameStatus.pendingBackend:
        //createUser(formFields);

        break;
      default:
    }
  }, [status]);

  const validateForm = (): void => {
    if (status !== CreateNewGameStatus.pendingValidation) {
      throw new Error('Unexpected form state at validateForm');
    }

    const formValidationValue: FormValidationNewGameResult = {};

    const numberOfPlayersValidation: Either<string, undefined> =
      validateNumberOfPlayers(formFields.players as number);

    if (!numberOfPlayersValidation.isRight) {
      formValidationValue.numberOfPlayers = numberOfPlayersValidation.value;
    }

    setFormValidation(formValidationValue);

    if (Object.values(formValidationValue).length === 0) {
      setStatus(CreateNewGameStatus.pendingBackend);
    } else {
      setStatus(CreateNewGameStatus.validationKO);
    }
  };

  return {
    formFields,
    status,
    notifyFormFieldsFilled,
    formValidation,
    backendError,
    setFormField,
  };
};
