import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../hooks/useRegisterConfirm');

import { RenderResult, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterConfirm } from './RegisterConfirm';
import {
  UNEXPECTED_ERROR_MESSAGE,
  useRegisterConfirm,
} from '../hooks/useRegisterConfirm';
import { RegisterConfirmStatus } from '../models/RegisterConfirmStatus';

describe(RegisterConfirm.name, () => {
  describe('when called, and useRegisterConfirm() returns a fulfilled status', () => {
    let confirmRegisterOkGridDisplayValue: string;

    beforeAll(() => {
      (
        useRegisterConfirm as jest.Mock<typeof useRegisterConfirm>
      ).mockReturnValueOnce({
        status: RegisterConfirmStatus.fulfilled,
        errorMessage: null,
      });

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <RegisterConfirm />
        </MemoryRouter>,
      );

      const confirmRegisterOkGrid: HTMLElement =
        renderResult.container.querySelector(
          '.confirm-register-ok',
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

    beforeAll(() => {
      (
        useRegisterConfirm as jest.Mock<typeof useRegisterConfirm>
      ).mockReturnValueOnce({
        status: RegisterConfirmStatus.rejected,
        errorMessage: UNEXPECTED_ERROR_MESSAGE,
      });

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <RegisterConfirm />
        </MemoryRouter>,
      );

      const confirmRegisterErrorGrid: HTMLElement =
        renderResult.container.querySelector(
          '.confirm-register-error-message',
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
