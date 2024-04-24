jest.mock('../helpers/validateNumberOfPlayers');
jest.mock('../../common/helpers/joinGame');
jest.mock('../../common/helpers/getUserMeId');
jest.mock('../../common/http/services/HttpService');
jest.mock('../../common/http/helpers/buildSerializableResponse');
jest.mock('../../app/store/hooks');
jest.mock('../../app/store/features/authSlice');

import { describe, expect, jest, it, beforeAll, afterAll } from '@jest/globals';

import { useAppSelector } from '../../app/store/hooks';
import { httpClient } from '../../common/http/services/HttpService';
import { getUserMeId } from '../../common/helpers/getUserMeId';
import { joinGame } from '../../common/helpers/joinGame';
import { validateNumberOfPlayers } from '../helpers/validateNumberOfPlayers';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { useCreateNewGame } from './useCreateNewGame';
import {
  RenderHookResult,
  renderHook,
  waitFor,
  act,
} from '@testing-library/react';
import { CreateNewGameResult } from '../models/CreateNewGameResult';
import { FormFieldsNewGame } from '../models/FormFieldsNewGame';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';
import { models as apiModels } from '@cornie-js/api-models';
import { Either } from '../../common/models/Either';
import { NewGameResponse } from '../../common/http/models/NewGameResponse';
import { NewGameSerializedResponse } from '../../common/http/models/NewGameSerializedResponse';
import { UserMeSerializedResponse } from '../../common/http/models/UserMeSerializedResponse';
import { FormNewGameValidationErrorResult } from './../models/FormNewGameValidationErrorResult';
import { JoinGameSerializedResponse } from '../../common/http/models/JoinGameSerializedResponse';
import { HTTP_BAD_REQUEST_ERROR_MESSAGE } from '../../common/helpers/errorMessages';

describe(useCreateNewGame.name, () => {
  let numberOfPlayersFixture: string;
  let tokenFixture: string | null;
  let formNewGameValidationErrorResultFixture: FormNewGameValidationErrorResult;
  let serializableUserIdFixture: UserMeSerializedResponse;
  let serializableJoinGameFixture: JoinGameSerializedResponse;

  beforeAll(() => {
    numberOfPlayersFixture = 'error-players';
    tokenFixture = 'token-fixture';

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
  });

  describe('when called, on initialize values', () => {
    let renderResult: RenderHookResult<CreateNewGameResult, unknown>;
    let formFieldsNewGame: FormFieldsNewGame;
    let statusNewGame: CreateNewGameStatus;

    beforeAll(() => {
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
      const optionsExpected: apiModels.GameOptionsV1 = {
        chainDraw2Draw2Cards: false,
        chainDraw2Draw4Cards: false,
        chainDraw4Draw4Cards: false,
        chainDraw4Draw2Cards: false,
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

    beforeAll(() => {
      (
        validateNumberOfPlayers as jest.Mock<typeof validateNumberOfPlayers>
      ).mockReturnValueOnce({
        isRight: false,
        value: numberOfPlayersFixture,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(tokenFixture);

      (getUserMeId as jest.Mock<typeof getUserMeId>).mockResolvedValueOnce(
        serializableUserIdFixture,
      );

      renderResult = renderHook(() => useCreateNewGame());
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      waitFor(() => {
        status = renderResult.result.current.status;
        expect(status).toBe(CreateNewGameStatus.validationKO);
      });

      formValidation = renderResult.result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
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
    let formFieldsNewGame: apiModels.GameCreateQueryV1;
    let newGameResponseFixture: NewGameResponse;
    let newGameSerializedResponseFixture: NewGameSerializedResponse;

    beforeAll(async () => {
      formFieldsNewGame = {
        gameSlotsAmount: 2,
        name: '',
        options: {
          chainDraw2Draw2Cards: false,
          chainDraw2Draw4Cards: false,
          chainDraw4Draw4Cards: false,
          chainDraw4Draw2Cards: false,
          playCardIsMandatory: false,
          playMultipleSameCards: false,
          playWildDraw4IfNoOtherAlternative: true,
        },
      };

      newGameResponseFixture = {
        headers: {},
        body: {
          id: 'id-fixture',
          name: 'name-fixture',
          state: {
            slots: [
              {
                userId: 'userId-fixture',
              },
            ],
            status: 'nonStarted',
          },
        },
        statusCode: 200,
      };

      newGameSerializedResponseFixture = {
        body: {
          id: 'id-fixture',
          name: 'name-fixture',
          state: {
            slots: [
              {
                userId: 'userId-fixture',
              },
            ],
            status: 'nonStarted',
          },
        },
        statusCode: 200,
      };

      (
        validateNumberOfPlayers as jest.Mock<typeof validateNumberOfPlayers>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(tokenFixture);

      (getUserMeId as jest.Mock<typeof getUserMeId>).mockResolvedValueOnce(
        serializableUserIdFixture,
      );

      (joinGame as jest.Mock<typeof joinGame>).mockResolvedValueOnce(
        serializableJoinGameFixture,
      );

      (
        httpClient.endpoints.createGame as jest.Mock<
          typeof httpClient.endpoints.createGame
        >
      ).mockResolvedValueOnce(newGameResponseFixture);

      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(newGameSerializedResponseFixture);

      renderResult = renderHook(() => useCreateNewGame());
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        status = renderResult.result.current.status;
        expect(status).toBe(CreateNewGameStatus.backendOK);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should called httpClient.endpoints.createGame()', () => {
      expect(httpClient.endpoints.createGame).toHaveBeenCalled();
      expect(httpClient.endpoints.createGame).toHaveBeenCalledWith(
        {
          authorization: `Bearer undefined`,
        },
        formFieldsNewGame,
      );
    });

    it('should return an status backend OK', () => {
      expect(status).toBe(CreateNewGameStatus.backendOK);
    });
  });

  describe('when called, and API returns a non OK response', () => {
    let renderResult: RenderHookResult<CreateNewGameResult, unknown>;
    let status: CreateNewGameStatus;
    let formFieldsNewGame: apiModels.GameCreateQueryV1;
    let newGameResponseFixture: NewGameResponse;
    let newGameSerializedResponseFixture: NewGameSerializedResponse;
    let backendError: string | null;

    beforeAll(async () => {
      formFieldsNewGame = {
        gameSlotsAmount: 2,
        name: '',
        options: {
          chainDraw2Draw2Cards: false,
          chainDraw2Draw4Cards: false,
          chainDraw4Draw4Cards: false,
          chainDraw4Draw2Cards: false,
          playCardIsMandatory: false,
          playMultipleSameCards: false,
          playWildDraw4IfNoOtherAlternative: true,
        },
      };

      newGameResponseFixture = {
        headers: {},
        body: {
          description: 'description-fixture',
        },
        statusCode: 400,
      };

      newGameSerializedResponseFixture = {
        body: {
          description: 'description-fixture',
        },
        statusCode: 400,
      };

      (
        validateNumberOfPlayers as jest.Mock<typeof validateNumberOfPlayers>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      (
        useAppSelector as unknown as jest.Mock<typeof useAppSelector>
      ).mockReturnValueOnce(tokenFixture);

      (getUserMeId as jest.Mock<typeof getUserMeId>).mockResolvedValueOnce(
        serializableUserIdFixture,
      );

      (joinGame as jest.Mock<typeof joinGame>).mockResolvedValueOnce(
        serializableJoinGameFixture,
      );

      (
        httpClient.endpoints.createGame as jest.Mock<
          typeof httpClient.endpoints.createGame
        >
      ).mockResolvedValueOnce(newGameResponseFixture);

      (
        buildSerializableResponse as jest.Mock<typeof buildSerializableResponse>
      ).mockReturnValueOnce(newGameSerializedResponseFixture);

      renderResult = renderHook(() => useCreateNewGame());
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        status = renderResult.result.current.status;
        backendError = renderResult.result.current.backendError;
        expect(status).toBe(CreateNewGameStatus.backendKO);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should called httpClient.endpoints.createGame()', () => {
      expect(httpClient.endpoints.createGame).toHaveBeenCalled();
      expect(httpClient.endpoints.createGame).toHaveBeenCalledWith(
        {
          authorization: `Bearer undefined`,
        },
        formFieldsNewGame,
      );
    });

    it('should return an status backend OK', () => {
      expect(status).toBe(CreateNewGameStatus.backendKO);
    });

    it('should return an error message Invalid Credentials', () => {
      expect(backendError).toBe(HTTP_BAD_REQUEST_ERROR_MESSAGE);
    });
  });
});
