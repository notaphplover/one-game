import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/helpers/isSerializableAppError');

import { SerializableAppError } from '@cornie-js/frontend-api-rtk-query';
import { AppErrorKind } from '@cornie-js/frontend-common';
import { SerializedError } from '@reduxjs/toolkit';

import { isSerializableAppError } from '../../common/helpers/isSerializableAppError';
import { getGamesV1ErrorMessage } from './getGamesV1ErrorMessage';

describe(getGamesV1ErrorMessage.name, () => {
  let errorFixture: SerializableAppError | SerializedError;

  describe('having an SerializableAppError with 400 HTTP code error ', () => {
    let result: string;
    let isSerializableAppErrorFixture: boolean;

    beforeAll(() => {
      errorFixture = {
        kind: AppErrorKind.contractViolation,
        message: 'contractViolation',
      };

      isSerializableAppErrorFixture = true;

      (
        isSerializableAppError as unknown as jest.Mock<
          typeof isSerializableAppError
        >
      ).mockReturnValue(isSerializableAppErrorFixture);

      result = getGamesV1ErrorMessage(errorFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an error message', () => {
      const expectedErrorMessage: string =
        'Unexpected error occurred while processing the request.';
      expect(result).toBe(expectedErrorMessage);
    });
  });

  describe('having an SerializableAppError with 401 HTTP code error ', () => {
    let result: string;
    let isSerializableAppErrorFixture: boolean;

    beforeAll(() => {
      errorFixture = {
        kind: AppErrorKind.missingCredentials,
        message: 'missingCredentials',
      };

      isSerializableAppErrorFixture = true;

      (
        isSerializableAppError as unknown as jest.Mock<
          typeof isSerializableAppError
        >
      ).mockReturnValue(isSerializableAppErrorFixture);

      result = getGamesV1ErrorMessage(errorFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an error message', () => {
      const expectedErrorMessage: string = 'Missing credentials.';
      expect(result).toBe(expectedErrorMessage);
    });
  });

  describe('having an SerializableAppError with 403 HTTP code error ', () => {
    let result: string;
    let isSerializableAppErrorFixture: boolean;

    beforeAll(() => {
      errorFixture = {
        kind: AppErrorKind.invalidCredentials,
        message: 'invalidCredentials',
      };

      isSerializableAppErrorFixture = true;

      (
        isSerializableAppError as unknown as jest.Mock<
          typeof isSerializableAppError
        >
      ).mockReturnValue(isSerializableAppErrorFixture);

      result = getGamesV1ErrorMessage(errorFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an error message', () => {
      const expectedErrorMessage: string = 'Invalid credentials.';
      expect(result).toBe(expectedErrorMessage);
    });
  });

  describe('having an SerializableAppError with unexpected HTTP code error ', () => {
    let result: string;
    let isSerializableAppErrorFixture: boolean;

    beforeAll(() => {
      errorFixture = {
        kind: AppErrorKind.entityConflict,
        message: 'entityConflict',
      };

      isSerializableAppErrorFixture = true;

      (
        isSerializableAppError as unknown as jest.Mock<
          typeof isSerializableAppError
        >
      ).mockReturnValue(isSerializableAppErrorFixture);

      result = getGamesV1ErrorMessage(errorFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an error message', () => {
      const expectedErrorMessage: string =
        'An error has ocurred. Is not possible to find any games.';
      expect(result).toBe(expectedErrorMessage);
    });
  });

  describe('having an SerializedError error ', () => {
    let result: string;
    let isSerializableAppErrorFixture: boolean;

    beforeAll(() => {
      errorFixture = {
        message: 'error-fixture',
      };

      isSerializableAppErrorFixture = false;

      (
        isSerializableAppError as unknown as jest.Mock<
          typeof isSerializableAppError
        >
      ).mockReturnValue(isSerializableAppErrorFixture);

      result = getGamesV1ErrorMessage(errorFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return an error message', () => {
      const expectedErrorMessage: string =
        'An error has ocurred. Is not possible to find any games.';
      expect(result).toBe(expectedErrorMessage);
    });
  });
});
