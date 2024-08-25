import { models as apiModels } from '@cornie-js/api-models';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either } from '../../common/models/Either';
import { NUMBER_PLAYERS_MINIMUM } from '../helpers/numberOfPlayersValues';
import { validateNumberOfPlayers } from '../helpers/validateNumberOfPlayers';
import { CreateNewGameResult } from '../models/CreateNewGameResult';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';
import { FormFieldsNewGame } from '../models/FormFieldsNewGame';
import { FormNewGameValidationErrorResult } from '../models/FormNewGameValidationErrorResult';
import { GameOptions } from '../models/GameOptions';

const UNEXPECTED_ERROR_MESSAGE: string =
  'Unexpected error. Please try again later';

export const useCreateNewGame = (): CreateNewGameResult => {
  const [formFields, setFormFields] = useState<FormFieldsNewGame>({
    isPublic: false,
    name: '',
    options: {
      chainDraw2Draw2Cards: false,
      chainDraw2Draw4Cards: false,
      chainDraw4Draw2Cards: false,
      chainDraw4Draw4Cards: false,
      playCardIsMandatory: false,
      playMultipleSameCards: false,
      playWildDraw4IfNoOtherAlternative: true,
    },
    players: NUMBER_PLAYERS_MINIMUM,
  });
  const [status, setStatus] = useState<CreateNewGameStatus>(
    CreateNewGameStatus.initial,
  );
  const [formValidation, setFormValidation] = useState<
    Either<FormNewGameValidationErrorResult, undefined>
  >({ isRight: true, value: undefined });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [gameId, setGameId] = useState<string | null>(null);

  const useGetUsersV1MeQueryResult = cornieApi.useGetUsersV1MeQuery({
    params: [],
  });

  const usersV1MeResult: Either<string, apiModels.UserV1> | null =
    mapUseQueryHookResult(useGetUsersV1MeQueryResult);

  const [triggerCreateGame, gameCreatedResult] =
    cornieApi.useCreateGamesV1Mutation();
  const [triggerCreateGameSlot, gameSlotCreatedResult] =
    cornieApi.useCreateGamesV1SlotsMutation();

  function assertFormFieldsCanBeUpdated(
    status: CreateNewGameStatus,
  ): asserts status is
    | CreateNewGameStatus.initial
    | CreateNewGameStatus.formValidationError {
    if (
      status !== CreateNewGameStatus.initial &&
      status !== CreateNewGameStatus.formValidationError
    ) {
      throw new Error('Unexpected form state at setFormField');
    }
  }

  const setFormFieldIsPublic = (
    _event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    checked: boolean,
  ): void => {
    assertFormFieldsCanBeUpdated(status);

    setFormFields({
      ...formFields,
      isPublic: checked,
    });
  };

  const setFormFieldName = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    assertFormFieldsCanBeUpdated(status);

    let name: string | undefined;
    if (event.target.value.trim() === '') {
      name = undefined;
    } else {
      name = event.target.value;
    }

    setFormFields({
      ...formFields,
      name,
    });
  };

  const setFormFieldPlayers = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    assertFormFieldsCanBeUpdated(status);

    let players: number;

    if (!isNaN(parseInt(event.target.value))) {
      players = parseInt(event.target.value);
    } else {
      players = NUMBER_PLAYERS_MINIMUM;
    }

    setFormFields({
      ...formFields,
      players,
    });
  };

  const setFormFieldOptions = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    assertFormFieldsCanBeUpdated(status);

    const options: GameOptions = formFields.options;

    const optionsWithChanges: GameOptions = {
      ...options,
      [event.target.value]: event.target.checked,
    };

    setFormFields({
      ...formFields,
      options: optionsWithChanges,
    });
  };

  const createGame = () => {
    const gameCreateQuery: apiModels.GameCreateQueryV1 = {
      gameSlotsAmount: formFields.players,
      isPublic: formFields.isPublic,
      options: formFields.options,
    };

    if (formFields.name !== undefined) {
      gameCreateQuery.name = formFields.name;
    }

    void triggerCreateGame({
      params: [gameCreateQuery],
    });
  };

  const joinGame = (usersV1MeResult: Either<string, apiModels.UserV1>) => {
    if (!usersV1MeResult.isRight || gameId === null) {
      setStatus(CreateNewGameStatus.backendError);
      setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      return;
    }

    const gameSlotCreateQuery: apiModels.GameIdSlotCreateQueryV1 = {
      userId: usersV1MeResult.value.id,
    };

    void triggerCreateGameSlot({
      params: [
        {
          gameId,
        },
        gameSlotCreateQuery,
      ],
    });
  };

  const notifyFormFieldsFilled = (): void => {
    setStatus(CreateNewGameStatus.validatingForm);
    setErrorMessage(null);
  };

  useEffect(() => {
    switch (status) {
      case CreateNewGameStatus.validatingForm:
        validateForm();
        break;
      case CreateNewGameStatus.formValidated:
        setStatus(CreateNewGameStatus.creatingGame);
        createGame();
        break;
      case CreateNewGameStatus.gameCreated:
        if (usersV1MeResult !== null) {
          setStatus(CreateNewGameStatus.joiningGame);
          joinGame(usersV1MeResult);
        }
        break;
      default:
    }
  }, [status, useGetUsersV1MeQueryResult]);

  useEffect(() => {
    switch (gameCreatedResult.status) {
      case QueryStatus.fulfilled:
        setStatus(CreateNewGameStatus.gameCreated);
        setGameId(gameCreatedResult.data.id);
        break;
      case QueryStatus.rejected:
        setStatus(CreateNewGameStatus.backendError);
        setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
        break;
      default:
        break;
    }
  }, [gameCreatedResult]);

  useEffect(() => {
    switch (gameSlotCreatedResult.status) {
      case QueryStatus.fulfilled:
        setStatus(CreateNewGameStatus.done);
        break;
      case QueryStatus.rejected:
        setStatus(CreateNewGameStatus.backendError);
        setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
        break;
      default:
        break;
    }
  }, [gameSlotCreatedResult]);

  const validateForm = (): void => {
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
      setStatus(CreateNewGameStatus.formValidated);
    } else {
      setFormValidation({
        isRight: false,
        value: formValidationValue,
      });
      setStatus(CreateNewGameStatus.formValidationError);
    }
  };

  return {
    errorMessage,
    formFields,
    formValidation,
    notifyFormFieldsFilled,
    setFormFieldIsPublic,
    setFormFieldName,
    setFormFieldOptions,
    setFormFieldPlayers,
    status,
  };
};
