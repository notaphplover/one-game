import { useEffect, useState } from 'react';
import { Either } from '../../common/models/Either';
import { CreateNewGameResult } from '../models/CreateNewGameResult';
import { selectAuthToken } from '../../app/store/features/authSlice';
import { useAppSelector } from '../../app/store/hooks';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';
import { FormFieldsNewGame } from '../models/FormFieldsNewGame';
import { FormNewGameValidationErrorResult } from '../models/FormNewGameValidationErrorResult';
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
import {
  GameCreateQueryV1,
  GameOptionsV1,
} from '@cornie-js/api-models/lib/models/types';

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
  const [formValidation, setFormValidation] = useState<
    Either<FormNewGameValidationErrorResult, undefined>
  >({ isRight: true, value: undefined });
  const [backendError, setBackendError] = useState<string | null>(null);

  const [gameId, setGameId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [backendErrorUser, setBackendErrorUser] = useState<string | null>(null);
  const [backendErrorGame, setBackendErrorGame] = useState<string | null>(null);

  const setFormFieldName = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (
      status !== CreateNewGameStatus.initial &&
      status !== CreateNewGameStatus.validationKO
    ) {
      throw new Error('Unexpected form state at setFormField');
    }

    const eventTargetValue: string = event.target.value;
    let finalValue: string | undefined;

    if (eventTargetValue.trim() !== '') {
      finalValue = eventTargetValue;
    } else {
      finalValue = undefined;
    }

    setFormFields({
      ...formFields,
      [event.target.name]: finalValue,
    });
  };

  const setFormFieldPlayers = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (
      status !== CreateNewGameStatus.initial &&
      status !== CreateNewGameStatus.validationKO
    ) {
      throw new Error('Unexpected form state at setFormField');
    }

    let finalValue: number;

    if (!isNaN(parseInt(event.target.value))) {
      finalValue = parseInt(event.target.value);
    } else {
      finalValue = NUMBER_PLAYERS_MINIMUM;
    }

    setFormFields({
      ...formFields,
      [event.target.name]: finalValue,
    });
  };

  const setFormFieldOptions = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (
      status !== CreateNewGameStatus.initial &&
      status !== CreateNewGameStatus.validationKO
    ) {
      throw new Error('Unexpected form state at setFormField');
    }

    const options: GameOptionsV1 = formFields.options;

    const optionsWithChanges: GameOptionsV1 = {
      ...options,
      [event.target.value]: event.target.checked,
    };
    setFormFields({
      ...formFields,
      ['options']: optionsWithChanges,
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

    const formValidationValue: FormNewGameValidationErrorResult = {};

    const numberOfPlayersValidation: Either<string, undefined> =
      validateNumberOfPlayers(formFields.players);

    if (!numberOfPlayersValidation.isRight) {
      formValidationValue.numberOfPlayers = numberOfPlayersValidation.value;
    }

    if (Object.values(formValidationValue).length === 0) {
      setFormValidation({
        isRight: true,
        value: undefined,
      });
      setStatus(CreateNewGameStatus.pendingBackend);
    } else {
      setFormValidation({
        isRight: false,
        value: formValidationValue,
      });
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
    let httpRequestQuery: GameCreateQueryV1;

    if (formFields.name !== undefined) {
      httpRequestQuery = {
        gameSlotsAmount: formFields.players,
        options: formFields.options,
        name: formFields.name,
      };
    } else {
      httpRequestQuery = {
        gameSlotsAmount: formFields.players,
        options: formFields.options,
      };
    }

    const response: NewGameResponse = await httpClient.createGame(
      {
        authorization: `Bearer ${token}`,
      },
      httpRequestQuery,
    );

    return buildSerializableResponse(response);
  };

  return {
    formFields,
    status,
    notifyFormFieldsFilled,
    formValidation,
    backendError,
    setFormFieldName,
    setFormFieldPlayers,
    setFormFieldOptions,
  };
};
