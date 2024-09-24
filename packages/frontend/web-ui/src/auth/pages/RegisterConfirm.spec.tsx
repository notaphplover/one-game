import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../hooks/useRegisterConfirm');
jest.mock('../../app/store/hooks');

import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
import {
  UNEXPECTED_ERROR_MESSAGE,
  useRegisterConfirm,
} from '../hooks/useRegisterConfirm';
import { RegisterConfirmStatus } from '../models/RegisterConfirmStatus';
import { RegisterConfirm } from './RegisterConfirm';

describe(RegisterConfirm.name, () => {
  describe('when called, and useRegisterConfirm() returns a fulfilled status', () => {
    let confirmRegisterOkGridDisplayValue: string;
    let authFixture: AuthenticatedAuthState | null;

    beforeAll(() => {
      authFixture = null;

      (
        useRegisterConfirm as jest.Mock<typeof useRegisterConfirm>
      ).mockReturnValueOnce({
        errorMessage: null,
        status: RegisterConfirmStatus.fulfilled,
      });

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        authFixture,
      );

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <RegisterConfirm />
        </MemoryRouter>,
      );

      const confirmRegisterOkGrid: HTMLElement =
        renderResult.container.querySelector(
          '.form-register-success',
        ) as HTMLElement;

      confirmRegisterOkGridDisplayValue = window
        .getComputedStyle(confirmRegisterOkGrid)
        .getPropertyValue('display');
    });

    afterAll(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    it('should show the success grid', () => {
      expect(confirmRegisterOkGridDisplayValue).not.toBe('none');
    });
  });

  describe('when called, and useRegisterConfirm() returns a rejected status', () => {
    let confirmRegisterErrorGridDisplayValue: string;
    let authFixture: AuthenticatedAuthState | null;

    beforeAll(() => {
      authFixture = null;

      (
        useRegisterConfirm as jest.Mock<typeof useRegisterConfirm>
      ).mockReturnValueOnce({
        errorMessage: UNEXPECTED_ERROR_MESSAGE,
        status: RegisterConfirmStatus.rejected,
      });

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        authFixture,
      );

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <RegisterConfirm />
        </MemoryRouter>,
      );

      const confirmRegisterErrorGrid: HTMLElement =
        renderResult.container.querySelector(
          '.form-register-error',
        ) as HTMLElement;

      confirmRegisterErrorGridDisplayValue = window
        .getComputedStyle(confirmRegisterErrorGrid)
        .getPropertyValue('display');
    });

    afterAll(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    it('should call hook useRegisterConfirm()', () => {
      expect(useRegisterConfirm).toHaveBeenCalledTimes(1);
      expect(useRegisterConfirm).toHaveBeenCalledWith();
    });

    it('should show the error grid', () => {
      expect(confirmRegisterErrorGridDisplayValue).not.toBe('none');
    });
  });
});
