jest.mock('../helpers/validateNumberOfPlayers');
jest.mock('../../common/helpers/joinGame');
jest.mock('../../common/helpers/getUserMeId');
jest.mock('./useCreateGame');
jest.mock('../../app/store/hooks');
jest.mock('../../app/store/features/authSlice');

import { describe, expect, jest, it, beforeAll, afterAll } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { RenderHookResult, renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';
import { useAppSelector } from '../../app/store/hooks';
import { getUserMeId } from '../../common/helpers/getUserMeId';
import { joinGame } from '../../common/helpers/joinGame';
import { JoinGameSerializedResponse } from '../../common/http/models/JoinGameSerializedResponse';
import { UserMeSerializedResponse } from '../../common/http/models/UserMeSerializedResponse';
import { Either } from '../../common/models/Either';
import { validateNumberOfPlayers } from '../helpers/validateNumberOfPlayers';
import { CreateNewGameResult } from '../models/CreateNewGameResult';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';
import { FormFieldsNewGame } from '../models/FormFieldsNewGame';
import { GameOptions } from '../models/GameOptions';
import { SingleApiCallHookResult } from './../../common/helpers/buildSingleApiCallHook';
import { FormNewGameValidationErrorResult } from './../models/FormNewGameValidationErrorResult';
import { useCreateGame } from './useCreateGame';
import { HTTP_BAD_REQUEST_ERROR_MESSAGE } from './useCreateGame/utils/unexpectedErrorMessage';
import { useCreateNewGame } from './useCreateNewGame';

describe(useCreateNewGame.name, () => {
  let numberOfPlayersFixture: string;
  let authenticatedAuthStateFixture: AuthenticatedAuthState;
  let formNewGameValidationErrorResultFixture: FormNewGameValidationErrorResult;
  let serializableUserIdFixture: UserMeSerializedResponse;
  let serializableJoinGameFixture: JoinGameSerializedResponse;
  let callNewGameMock: jest.Mock<(params: FormFieldsNewGame) => void>;
  let singleApiCallHookResultFixture: SingleApiCallHookResult<
    FormFieldsNewGame,
    apiModels.NonStartedGameV1
  >;

  beforeAll(() => {
    numberOfPlayersFixture = 'error-players';

    authenticatedAuthStateFixture = {
      accessToken: 'accessToken-fixture',
      refreshToken: 'refreshToken-fixture',
      status: AuthStateStatus.authenticated,
    };

    formNewGameValidationErrorResultFixture = {
      numberOfPlayers: numberOfPlayersFixture,
    };

    serializableUserIdFixture = {
      body: {
        active: true,
        id: 'id-fixture',
        name: 'name-fixture',
      },
      statusCode: 200,
    };

    serializableJoinGameFixture = {
      body: {
        userId: 'user-id-fixture',
      },
      statusCode: 200,
    };

    callNewGameMock = jest.fn();

    singleApiCallHookResultFixture = {
      call: callNewGameMock,
      result: null,
    };
  });

  describe('when called, on initialize values', () => {
    let renderResult: RenderHookResult<CreateNewGameResult, unknown>;
    let formFieldsNewGame: FormFieldsNewGame;
    let statusNewGame: CreateNewGameStatus;

    beforeAll(() => {
      (useCreateGame as jest.Mock<typeof useCreateGame>).mockReturnValueOnce(
        singleApiCallHookResultFixture,
      );

      renderResult = renderHook(() => useCreateNewGame());

      formFieldsNewGame = renderResult.result.current.formFields;
      statusNewGame = renderResult.result.current.status;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should initialize values on name', () => {
      const nameExpected: string = '';
      expect(formFieldsNewGame.name).toStrictEqual(nameExpected);
    });

    it('should initialize values on players', () => {
      const playersExpected: number = 2;
      expect(formFieldsNewGame.players).toStrictEqual(playersExpected);
    });

    it('should initialize values on options', () => {
      const optionsExpected: GameOptions = {
        chainDraw2Draw2Cards: false,
        chainDraw2Draw4Cards: false,
        chainDraw4Draw2Cards: false,
        chainDraw4Draw4Cards: false,
        playCardIsMandatory: false,
        playMultipleSameCards: false,
        playWildDraw4IfNoOtherAlternative: true,
      };
      expect(formFieldsNewGame.options).toStrictEqual(optionsExpected);
    });

    it('should initialize values on status', () => {
      expect(statusNewGame).toBe(CreateNewGameStatus.initial);
    });
  });

  describe('when called, and players input value is not correct', () => {
    let renderResult: RenderHookResult<CreateNewGameResult, unknown>;
    let status: CreateNewGameStatus;
    let formValidation: Either<FormNewGameValidationErrorResult, undefined>;

    beforeAll(async () => {
      (
        validateNumberOfPlayers as jest.Mock<typeof validateNumberOfPlayers>
      ).mockReturnValueOnce({
        isRight: false,
        value: numberOfPlayersFixture,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(authenticatedAuthStateFixture);

      (getUserMeId as jest.Mock<typeof getUserMeId>).mockResolvedValueOnce(
        serializableUserIdFixture,
      );

      (useCreateGame as jest.Mock<typeof useCreateGame>).mockReturnValue(
        singleApiCallHookResultFixture,
      );

      renderResult = renderHook(() => useCreateNewGame());
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        status = renderResult.result.current.status;
        // eslint-disable-next-line jest/no-standalone-expect
        expect(status).toBe(CreateNewGameStatus.validationKO);
      });

      formValidation = renderResult.result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should have been called validateNumberOfPlayers once', () => {
      expect(validateNumberOfPlayers).toHaveBeenCalledTimes(1);
    });

    it('should have been called validateNumberOfPlayers with arguments', () => {
      const players: number = 2;
      expect(validateNumberOfPlayers).toHaveBeenCalledWith(players);
    });

    it('should return an invalid name error message', () => {
      const resultValidation: Either<
        FormNewGameValidationErrorResult,
        unknown
      > = {
        isRight: false,
        value: formNewGameValidationErrorResultFixture,
      };
      expect(formValidation).toStrictEqual(resultValidation);
    });

    it('should return an status validation KO', () => {
      expect(status).toBe(CreateNewGameStatus.validationKO);
    });
  });

  describe('when called, and API returns an OK response', () => {
    let renderResult: RenderHookResult<CreateNewGameResult, unknown>;
    let status: CreateNewGameStatus;
    let singleApiCallHookFixture: SingleApiCallHookResult<
      FormFieldsNewGame,
      apiModels.NonStartedGameV1
    >;

    beforeAll(async () => {
      singleApiCallHookFixture = {
        call: callNewGameMock,
        result: {
          isRight: true,
          value: {
            id: 'id-fixture',
            name: 'name-fixture',
            state: {
              slots: [{ userId: 'userId-fixture' }],
              status: 'nonStarted',
            },
          },
        },
      };

      (
        validateNumberOfPlayers as jest.Mock<typeof validateNumberOfPlayers>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(authenticatedAuthStateFixture);

      (getUserMeId as jest.Mock<typeof getUserMeId>).mockResolvedValueOnce(
        serializableUserIdFixture,
      );

      (joinGame as jest.Mock<typeof joinGame>).mockResolvedValueOnce(
        serializableJoinGameFixture,
      );

      (useCreateGame as jest.Mock<typeof useCreateGame>).mockReturnValue(
        singleApiCallHookFixture,
      );

      renderResult = renderHook(() => useCreateNewGame());
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        status = renderResult.result.current.status;
        // eslint-disable-next-line jest/no-standalone-expect
        expect(status).toBe(CreateNewGameStatus.backendOK);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should called useCreateGame hook', () => {
      const formFieldsNewGameExpected: FormFieldsNewGame = {
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
        players: 2,
      };
      expect(singleApiCallHookFixture.call).toHaveBeenCalledTimes(1);
      expect(singleApiCallHookFixture.call).toHaveBeenCalledWith(
        formFieldsNewGameExpected,
      );
    });

    it('should return an status backend OK', () => {
      expect(status).toBe(CreateNewGameStatus.backendOK);
    });
  });

  describe('when called, and API returns a non OK response', () => {
    let renderResult: RenderHookResult<CreateNewGameResult, unknown>;
    let backendError: string | null;
    let status: CreateNewGameStatus;
    let singleApiCallHookFixture: SingleApiCallHookResult<
      FormFieldsNewGame,
      apiModels.NonStartedGameV1
    >;

    beforeAll(async () => {
      singleApiCallHookFixture = {
        call: callNewGameMock,
        result: {
          isRight: false,
          value: HTTP_BAD_REQUEST_ERROR_MESSAGE,
        },
      };

      (
        validateNumberOfPlayers as jest.Mock<typeof validateNumberOfPlayers>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValue(authenticatedAuthStateFixture);

      (getUserMeId as jest.Mock<typeof getUserMeId>).mockResolvedValueOnce(
        serializableUserIdFixture,
      );

      (joinGame as jest.Mock<typeof joinGame>).mockResolvedValueOnce(
        serializableJoinGameFixture,
      );

      (useCreateGame as jest.Mock<typeof useCreateGame>).mockReturnValue(
        singleApiCallHookFixture,
      );

      renderResult = renderHook(() => useCreateNewGame());
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        status = renderResult.result.current.status;
        backendError = renderResult.result.current.backendError;
        // eslint-disable-next-line jest/no-standalone-expect
        expect(status).toBe(CreateNewGameStatus.backendKO);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should called useCreateGame hook', () => {
      const formFieldsNewGameExpected: FormFieldsNewGame = {
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
        players: 2,
      };
      expect(singleApiCallHookFixture.call).toHaveBeenCalledTimes(1);
      expect(singleApiCallHookFixture.call).toHaveBeenCalledWith(
        formFieldsNewGameExpected,
      );
    });

    it('should return an status backend KO', () => {
      expect(status).toBe(CreateNewGameStatus.backendKO);
    });

    it('should return an backend error', () => {
      expect(backendError).toBe(HTTP_BAD_REQUEST_ERROR_MESSAGE);
    });
  });
});
