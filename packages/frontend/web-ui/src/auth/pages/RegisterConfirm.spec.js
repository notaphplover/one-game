import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterConfirm } from './RegisterConfirm';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
  };
});
jest.mock('../../common/http/services/HttpService');
jest.mock('../../common/http/helpers');

describe(RegisterConfirm.name, () => {
  let authErrorMessageFixture;
  let dispatchMock;
  let tokenFixture;

  beforeAll(() => {
    authErrorMessageFixture = null;
    dispatchMock = jest.fn().mockResolvedValue(undefined);
    tokenFixture = null;

    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockImplementation(() => ({
      token: tokenFixture,
      errorMessage: authErrorMessageFixture,
    }));
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('having a window with location.href with code query', () => {
    let previousLocation;
    let locationFixture;

    beforeAll(() => {
      previousLocation = window.location;
      locationFixture = new URL('http://corniegame.com/auth/path?code=code');

      Object.defineProperty(window, 'location', {
        value: new URL(locationFixture),
        configurable: true,
      });
    });

    describe('when called, and httpClient.updateUserMe() returns an OK response', () => {
      let confirmRegisterOkGridDisplayValue;

      beforeAll(async () => {
        tokenFixture = 'jwt token fixture';

        httpClient.updateUserMe.mockReturnValueOnce({
          headers: {},
          body: {
            active: true,
            id: 'id',
            name: 'name',
          },
          statusCode: 200,
        });

        buildSerializableResponse.mockImplementation((response) => ({
          body: response.body,
          statusCode: response.statusCode,
        }));

        render(
          <MemoryRouter>
            <RegisterConfirm />
          </MemoryRouter>,
        );

        await waitFor(() => {
          const confirmRegisterOkGrid = screen.getByLabelText(
            'confirm-register-ok',
          );

          confirmRegisterOkGridDisplayValue = window
            .getComputedStyle(confirmRegisterOkGrid)
            .getPropertyValue('display');

          expect(confirmRegisterOkGridDisplayValue).not.toBe('none');
        });
      });

      it('should show the success grid', () => {
        expect(confirmRegisterOkGridDisplayValue).not.toBe('none');
      });
    });

    describe('when called, and httpClient.updateUserMe() returns a non OK response', () => {
      let confirmRegisterErrorGridDisplayValue;

      beforeAll(async () => {
        tokenFixture = 'jwt token fixture';
        authErrorMessageFixture = 'Unexpected error!';

        httpClient.updateUserMe.mockReturnValueOnce({
          headers: {},
          body: {
            code: null,
            description: 'Error Fixture',
            parameters: {},
          },
          statusCode: 401,
        });

        buildSerializableResponse.mockImplementation((response) => ({
          body: response.body,
          statusCode: response.statusCode,
        }));

        render(
          <MemoryRouter>
            <RegisterConfirm />
          </MemoryRouter>,
        );

        await waitFor(() => {
          const confirmRegisterErrorGrid = screen.getByLabelText(
            'confirm-register-error-message',
          );

          confirmRegisterErrorGridDisplayValue = window
            .getComputedStyle(confirmRegisterErrorGrid)
            .getPropertyValue('display');

          expect(confirmRegisterErrorGridDisplayValue).not.toBe('none');
        });
      });

      it('should show the error grid', () => {
        expect(confirmRegisterErrorGridDisplayValue).not.toBe('none');
      });
    });

    describe('when called, and token is null', () => {
      let confirmRegisterErrorTokenGridDisplayValue;

      beforeAll(async () => {
        tokenFixture = null;
        authErrorMessageFixture = 'Unexpected error!';

        render(
          <MemoryRouter>
            <RegisterConfirm />
          </MemoryRouter>,
        );

        const confirmRegisterErrorTokenGrid = screen.getByLabelText(
          'confirm-register-error-message',
        );

        confirmRegisterErrorTokenGridDisplayValue = window
          .getComputedStyle(confirmRegisterErrorTokenGrid)
          .getPropertyValue('display');
      });

      it('should show the error grid', () => {
        expect(confirmRegisterErrorTokenGridDisplayValue).not.toBe('none');
        expect(dispatchMock).toHaveBeenCalled();
      });
    });

    afterAll(() => {
      Object.defineProperty(window, 'location', {
        value: previousLocation,
        configurable: true,
      });
    });
  });

  describe('having a window with location.href without code query', () => {
    let previousLocation;
    let locationFixture;

    beforeAll(() => {
      previousLocation = window.location;
      locationFixture = new URL('http://corniegame.com/auth/path?code=');

      Object.defineProperty(window, 'location', {
        value: new URL(locationFixture),
        configurable: true,
      });
    });

    describe('when called, and code query not exists and the error grid is showed', () => {
      let confirmRegisterErrorGridDisplayValue;

      beforeAll(async () => {
        render(
          <MemoryRouter>
            <RegisterConfirm />
          </MemoryRouter>,
        );

        const confirmRegisterErrorGrid = screen.getByLabelText(
          'confirm-register-error-message',
        );

        confirmRegisterErrorGridDisplayValue = window
          .getComputedStyle(confirmRegisterErrorGrid)
          .getPropertyValue('display');
      });

      it('should show the error grid', () => {
        expect(confirmRegisterErrorGridDisplayValue).not.toBe('none');
      });
    });

    afterAll(() => {
      Object.defineProperty(window, 'location', {
        value: previousLocation,
        configurable: true,
      });
    });
  });
});
