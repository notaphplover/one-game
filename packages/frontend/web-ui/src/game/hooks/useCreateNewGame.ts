import { useEffect, useState } from 'react';
import { Either } from '../../common/models/Either';
import {
  SetFormFieldsParams,
  CreateNewGameResult,
} from '../models/CreateNewGameResult';
import { selectAuthToken } from '../../app/store/features/authSlice';
import { useAppSelector } from '../../app/store/hooks';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';
import { FormFieldsNewGame } from '../models/FormFieldsNewGame';
import { FormValidationNewGameResult } from '../models/FormValidationNewGameResult';
import { httpClient } from '../../common/http/services/HttpService';
import { getUserMeId } from '../../common/helpers/getUserMeId';
import { joinGame } from '../../common/helpers/joinGame';
import { NewGameResponse } from '../../common/http/models/NewGameResponse';
import { validateNumberOfPlayers } from '../../common/helpers/validateNumberOfPlayers';
import { NUMBER_PLAYERS_MINIMUM } from '../../common/helpers/numberPlayersLength';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { NewGameSerializedResponse } from '../../common/http/models/NewGameSerializedResponse';
import { UserMeSerializedResponse } from '../../common/http/models/UserMeSerializedResponse';
import { JoinGameSerializedResponse } from '../../common/http/models/JoinGameSerializedResponse';
import {
  FORBIDDEN_ERROR_MESSAGE,
  HTTP_BAD_REQUEST_ERROR_MESSAGE,
  INVALID_CREDENTIALS_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_MESSAGE,
  UNPROCESSABLE_REQUEST_ERROR_MESSAGE,
} from '../../common/helpers/errorMessage';
import { HTTP_CONFLICT_ERROR_MESSAGE } from '../../auth/hooks/useRegisterForm';

export const useCreateNewGame = (): CreateNewGameResult => {
  const token: string | null = useAppSelector(selectAuthToken);
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

  const [gameId, setGameId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [backendErrorUser, setBackendErrorUser] = useState<string | null>(null);
  const [backendErrorGame, setBackendErrorGame] = useState<string | null>(null);

  const setFormField = (params: SetFormFieldsParams): void => {
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
        if (token !== null) {
          setUserMe(token);
        }
        break;
      case CreateNewGameStatus.pendingBackend:
        createGame(formFields);
        break;
      case CreateNewGameStatus.backendOK:
        if (token !== null && gameId !== null && userId !== null) {
          joinNewGame(token, gameId, userId);
        }
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

  const setUserMe = async (token: string): Promise<void> => {
    if (status !== CreateNewGameStatus.pendingValidation) {
      throw new Error('Unexpected form state at createGame');
    }
    const responseUser: UserMeSerializedResponse = await getUserMeId(token);

    switch (responseUser.statusCode) {
      case 200:
        setUserId(responseUser.body.id);
        break;
      case 401:
        setBackendErrorUser(UNAUTHORIZED_ERROR_MESSAGE);
        break;
      case 403:
        setBackendErrorUser(INVALID_CREDENTIALS_ERROR_MESSAGE);
        break;
      default:
    }
  };

  const joinNewGame = async (
    token: string,
    gameId: string,
    userId: string,
  ): Promise<void> => {
    if (status !== CreateNewGameStatus.backendOK) {
      throw new Error('Unexpected form state at createGame');
    }

    const responseJoinGame: JoinGameSerializedResponse = await joinGame(
      token,
      gameId,
      userId,
    );

    switch (responseJoinGame.statusCode) {
      case 200:
        setUserId(responseJoinGame.body.userId);
        break;
      case 400:
        setBackendErrorGame(HTTP_BAD_REQUEST_ERROR_MESSAGE);
        break;
      case 401:
        setBackendErrorGame(UNAUTHORIZED_ERROR_MESSAGE);
        break;
      case 403:
        setBackendErrorGame(FORBIDDEN_ERROR_MESSAGE);
        break;
      case 409:
        setBackendErrorGame(HTTP_CONFLICT_ERROR_MESSAGE);
        break;
      case 422:
        setBackendErrorGame(UNPROCESSABLE_REQUEST_ERROR_MESSAGE);
        break;
      default:
    }
  };

  const createGame = async (formFields: FormFieldsNewGame): Promise<void> => {
    if (status !== CreateNewGameStatus.pendingBackend) {
      throw new Error('Unexpected form state at createGame');
    }

    const response: NewGameSerializedResponse =
      await fetchCreateGame(formFields);

    switch (response.statusCode) {
      case 200:
        setGameId(response.body.id);
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
