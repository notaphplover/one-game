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
import { NUMBER_PLAYERS_MINIMUM } from '../../common/helpers/numberPlayersLength';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { httpClient } from '../../common/http/services/HttpService';
import { NewGameResponse } from '../../common/http/models/NewGameResponse';
import { NewGameSerializedResponse } from '../../common/http/models/NewGameSerializedResponse';
import { useAppSelector } from '../../app/store/hooks';
import { selectAuthToken } from '../../app/store/features/authSlice';

const UNAUTHORIZED_ERROR_MESSAGE: string = 'Unauthorized error.';
const HTTP_BAD_REQUEST_ERROR_MESSAGE: string =
  'Unexpected error occurred while processing the request.';
const FORBIDDEN_ERROR_MESSAGE: string = `Forbidden error.`;

export const useCreateNewGame = (): CreateNewGameResult => {
  const [formFields, setFormFields] = useState<FormFieldsNewGame>({
    name: '',
    players: NUMBER_PLAYERS_MINIMUM,
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
  const token: string | null = useAppSelector(selectAuthToken);

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
        createGame(formFields);
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
      validateNumberOfPlayers(formFields.players);

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

  const createGame = async (formFields: FormFieldsNewGame): Promise<void> => {
    if (status !== CreateNewGameStatus.pendingBackend) {
      throw new Error('Unexpected form state at createUser');
    }

    const response: NewGameSerializedResponse =
      await fetchCreateGame(formFields);

    switch (response.statusCode) {
      case 200:
        setStatus(CreateNewGameStatus.backendOK);
        break;
      case 400:
        setBackendError(HTTP_BAD_REQUEST_ERROR_MESSAGE);
        setStatus(CreateNewGameStatus.backendKO);
        break;
      case 401:
        setBackendError(UNAUTHORIZED_ERROR_MESSAGE);
        setStatus(CreateNewGameStatus.backendKO);
        break;
      default:
        setBackendError(FORBIDDEN_ERROR_MESSAGE);
        setStatus(CreateNewGameStatus.backendKO);
    }
  };

  const fetchCreateGame = async (
    formFields: FormFieldsNewGame,
  ): Promise<NewGameSerializedResponse> => {
    const response: NewGameResponse = await httpClient.createGame(
      {
        authorization: `Bearer ${token}`,
      },
      {
        gameSlotsAmount: formFields.players,
        name: formFields.name,
        options: formFields.options,
      },
    );

    return buildSerializableResponse(response);
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
