jest.mock('../../common/helpers/mapUseQueryHookResult');
jest.mock('../../common/http/services/cornieApi');
jest.mock('../helpers/validateNumberOfPlayers');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { act } from 'react';

import { mapUseQueryHookResult } from '../../common/helpers/mapUseQueryHookResult';
import { cornieApi } from '../../common/http/services/cornieApi';
import { Either, Left } from '../../common/models/Either';
import { validateNumberOfPlayers } from '../helpers/validateNumberOfPlayers';
import { CreateNewGameResult } from '../models/CreateNewGameResult';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';
import { FormFieldsNewGame } from '../models/FormFieldsNewGame';
import { GameOptions } from '../models/GameOptions';
import { FormNewGameValidationErrorResult } from './../models/FormNewGameValidationErrorResult';
import { useCreateNewGame } from './useCreateNewGame';

describe(useCreateNewGame.name, () => {
  describe('when called()', () => {
    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useCreateGamesV1MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateGamesV1Mutation>
    >;
    let useCreateGamesV1SlotsMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateGamesV1SlotsMutation>
    >;

    let renderResult: RenderHookResult<CreateNewGameResult, unknown>;
    let formFieldsNewGame: FormFieldsNewGame;
    let statusNewGame: CreateNewGameStatus;

    beforeAll(() => {
      useGetUsersV1MeQueryResultMock = {
        data: undefined,
        error: undefined,
        isLoading: false,
        refetch: jest.fn(),
      };

      useCreateGamesV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useCreateGamesV1SlotsMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      (
        cornieApi.useGetUsersV1MeQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeQuery
        >
      ).mockReturnValueOnce(useGetUsersV1MeQueryResultMock);
      (
        cornieApi.useCreateGamesV1Mutation as jest.Mock<
          typeof cornieApi.useCreateGamesV1Mutation
        >
      ).mockReturnValueOnce(useCreateGamesV1MutationResultMock);
      (
        cornieApi.useCreateGamesV1SlotsMutation as jest.Mock<
          typeof cornieApi.useCreateGamesV1SlotsMutation
        >
      ).mockReturnValueOnce(useCreateGamesV1SlotsMutationResultMock);

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValueOnce(null);

      renderResult = renderHook(() => useCreateNewGame());

      formFieldsNewGame = renderResult.result.current.formFields;
      statusNewGame = renderResult.result.current.status;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call cornieApi.useGetUsersV1MeQuery()', () => {
      const expectedParams: Parameters<typeof cornieApi.useGetUsersV1MeQuery> =
        [
          {
            params: [],
          },
        ];

      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledTimes(1);
      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should call cornieApi.useCreateGamesV1Mutation()', () => {
      expect(cornieApi.useCreateGamesV1Mutation).toHaveBeenCalledTimes(1);
      expect(cornieApi.useCreateGamesV1Mutation).toHaveBeenCalledWith();
    });

    it('should call cornieApi.useCreateGamesV1SlotsMutation()', () => {
      expect(cornieApi.useCreateGamesV1SlotsMutation).toHaveBeenCalledTimes(1);
      expect(cornieApi.useCreateGamesV1SlotsMutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(1);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useGetUsersV1MeQueryResultMock,
      );
    });

    it('should have initial isPublic value', () => {
      expect(formFieldsNewGame.isPublic).toBe(false);
    });

    it('should have initial name value', () => {
      const expectedName: string = '';
      expect(formFieldsNewGame.name).toStrictEqual(expectedName);
    });

    it('should have initial players amount', () => {
      const playersExpected: number = 2;
      expect(formFieldsNewGame.players).toStrictEqual(playersExpected);
    });

    it('should have initial options', () => {
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

    it('should have initial status', () => {
      expect(statusNewGame).toBe(CreateNewGameStatus.initial);
    });
  });

  describe('when called, and validateNumberOfPlayers() returns Left', () => {
    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useCreateGamesV1MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateGamesV1Mutation>
    >;
    let useCreateGamesV1SlotsMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateGamesV1SlotsMutation>
    >;
    let validateNumberOfPlayersErrorFixture: Left<string>;

    let renderResult: RenderHookResult<CreateNewGameResult, unknown>;
    let status: CreateNewGameStatus;
    let formValidation: Either<FormNewGameValidationErrorResult, undefined>;

    beforeAll(async () => {
      useGetUsersV1MeQueryResultMock = {
        data: undefined,
        error: undefined,
        isLoading: false,
        refetch: jest.fn(),
      };

      useCreateGamesV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      useCreateGamesV1SlotsMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      (
        cornieApi.useGetUsersV1MeQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeQuery
        >
      ).mockReturnValue(useGetUsersV1MeQueryResultMock);
      (
        cornieApi.useCreateGamesV1Mutation as jest.Mock<
          typeof cornieApi.useCreateGamesV1Mutation
        >
      ).mockReturnValue(useCreateGamesV1MutationResultMock);
      (
        cornieApi.useCreateGamesV1SlotsMutation as jest.Mock<
          typeof cornieApi.useCreateGamesV1SlotsMutation
        >
      ).mockReturnValue(useCreateGamesV1SlotsMutationResultMock);

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValue({
        isRight: false,
        value: '',
      });

      validateNumberOfPlayersErrorFixture = {
        isRight: false,
        value: 'error-fixture',
      };

      (
        validateNumberOfPlayers as jest.Mock<typeof validateNumberOfPlayers>
      ).mockReturnValueOnce(validateNumberOfPlayersErrorFixture);

      renderResult = renderHook(() => useCreateNewGame());

      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        status = renderResult.result.current.status;
        // eslint-disable-next-line jest/no-standalone-expect
        expect(status).toBe(CreateNewGameStatus.formValidationError);
      });

      formValidation = renderResult.result.current.formValidation;
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should call cornieApi.useGetUsersV1MeQuery()', () => {
      const expectedParams: Parameters<typeof cornieApi.useGetUsersV1MeQuery> =
        [
          {
            params: [],
          },
        ];

      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledTimes(3);
      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should call cornieApi.useCreateGamesV1Mutation()', () => {
      expect(cornieApi.useCreateGamesV1Mutation).toHaveBeenCalledTimes(3);
      expect(cornieApi.useCreateGamesV1Mutation).toHaveBeenCalledWith();
    });

    it('should call cornieApi.useCreateGamesV1SlotsMutation()', () => {
      expect(cornieApi.useCreateGamesV1SlotsMutation).toHaveBeenCalledTimes(3);
      expect(cornieApi.useCreateGamesV1SlotsMutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(3);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useGetUsersV1MeQueryResultMock,
      );
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
        value: {
          numberOfPlayers: validateNumberOfPlayersErrorFixture.value,
        },
      };
      expect(formValidation).toStrictEqual(resultValidation);
    });

    it('should return an status validation KO', () => {
      expect(status).toBe(CreateNewGameStatus.formValidationError);
    });
  });

  describe('when called, and API returns an OK response', () => {
    let gameV1Fixture: apiModels.NonStartedGameV1;
    let gameV1SlotFixture: apiModels.NonStartedGameSlotV1;

    let useGetUsersV1MeQueryResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useGetUsersV1MeQuery>
    >;
    let useCreateGamesV1MutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateGamesV1Mutation>
    >;
    let useCreateGamesV1SlotsMutationResultMock: jest.Mocked<
      ReturnType<typeof cornieApi.useCreateGamesV1SlotsMutation>
    >;

    let renderResult: RenderHookResult<CreateNewGameResult, unknown>;
    let status: CreateNewGameStatus;

    beforeAll(async () => {
      gameV1Fixture = {
        id: 'id-fixture',
        isPublic: false,
        name: 'name-fixture',
        state: {
          slots: [{ userId: 'userId-fixture' }],
          status: 'nonStarted',
        },
      };

      gameV1SlotFixture = {
        userId: 'userId-fixture',
      };

      const userV1Fixture: apiModels.UserV1 = {
        active: true,
        id: 'userId-fixture',
        name: 'name fixture',
      };

      useGetUsersV1MeQueryResultMock = {
        data: userV1Fixture,
        error: false,
        isLoading: false,
        refetch: jest.fn(),
      };

      useCreateGamesV1MutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      const [triggerCreateGamesMock] = useCreateGamesV1MutationResultMock;

      triggerCreateGamesMock.mockImplementation(
        (): ReturnType<typeof triggerCreateGamesMock> => {
          const gamePayload: Awaited<
            ReturnType<typeof triggerCreateGamesMock>
          > = {
            data: gameV1Fixture,
            error: undefined,
          };

          useCreateGamesV1MutationResultMock = [
            triggerCreateGamesMock,
            {
              data: gameV1Fixture,
              reset: jest.fn(),
              status: QueryStatus.fulfilled,
            },
          ];

          return Promise.resolve(gamePayload) as ReturnType<
            typeof triggerCreateGamesMock
          >;
        },
      );

      useCreateGamesV1SlotsMutationResultMock = [
        jest.fn(),
        {
          reset: jest.fn(),
          status: QueryStatus.uninitialized,
        },
      ];

      const [triggerCreateGamesSlotMock] =
        useCreateGamesV1SlotsMutationResultMock;

      triggerCreateGamesSlotMock.mockImplementation(
        (): ReturnType<typeof triggerCreateGamesSlotMock> => {
          const gameSlotPayload: Awaited<
            ReturnType<typeof triggerCreateGamesSlotMock>
          > = {
            data: gameV1SlotFixture,
            error: undefined,
          };

          useCreateGamesV1SlotsMutationResultMock = [
            triggerCreateGamesSlotMock,
            {
              data: gameV1SlotFixture,
              reset: jest.fn(),
              status: QueryStatus.fulfilled,
            },
          ];

          return Promise.resolve(gameSlotPayload) as ReturnType<
            typeof triggerCreateGamesSlotMock
          >;
        },
      );

      (
        cornieApi.useGetUsersV1MeQuery as jest.Mock<
          typeof cornieApi.useGetUsersV1MeQuery
        >
      ).mockReturnValue(useGetUsersV1MeQueryResultMock);
      (
        cornieApi.useCreateGamesV1Mutation as jest.Mock<
          typeof cornieApi.useCreateGamesV1Mutation
        >
      )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementation((): any => useCreateGamesV1MutationResultMock);
      (
        cornieApi.useCreateGamesV1SlotsMutation as jest.Mock<
          typeof cornieApi.useCreateGamesV1SlotsMutation
        >
      )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .mockImplementation((): any => useCreateGamesV1SlotsMutationResultMock);

      (
        mapUseQueryHookResult as jest.Mock<typeof mapUseQueryHookResult>
      ).mockReturnValue({
        isRight: true,
        value: userV1Fixture,
      });

      (
        validateNumberOfPlayers as jest.Mock<typeof validateNumberOfPlayers>
      ).mockReturnValueOnce({
        isRight: true,
        value: undefined,
      });

      renderResult = renderHook(() => useCreateNewGame());
      const notifyFormFieldsFilled: () => void =
        renderResult.result.current.notifyFormFieldsFilled;

      act(() => {
        notifyFormFieldsFilled();
      });

      await waitFor(() => {
        status = renderResult.result.current.status;
        // eslint-disable-next-line jest/no-standalone-expect
        expect(status).toBe(CreateNewGameStatus.done);
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should call cornieApi.useGetUsersV1MeQuery()', () => {
      const expectedParams: Parameters<typeof cornieApi.useGetUsersV1MeQuery> =
        [
          {
            params: [],
          },
        ];

      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledTimes(7);
      expect(cornieApi.useGetUsersV1MeQuery).toHaveBeenCalledWith(
        ...expectedParams,
      );
    });

    it('should call cornieApi.useCreateGamesV1Mutation()', () => {
      expect(cornieApi.useCreateGamesV1Mutation).toHaveBeenCalledTimes(7);
      expect(cornieApi.useCreateGamesV1Mutation).toHaveBeenCalledWith();
    });

    it('should call cornieApi.useCreateGamesV1SlotsMutation()', () => {
      expect(cornieApi.useCreateGamesV1SlotsMutation).toHaveBeenCalledTimes(7);
      expect(cornieApi.useCreateGamesV1SlotsMutation).toHaveBeenCalledWith();
    });

    it('should call mapUseQueryHookResult()', () => {
      expect(mapUseQueryHookResult).toHaveBeenCalledTimes(7);
      expect(mapUseQueryHookResult).toHaveBeenCalledWith(
        useGetUsersV1MeQueryResultMock,
      );
    });

    it('should return an status backend OK', () => {
      expect(status).toBe(CreateNewGameStatus.done);
    });
  });
});
