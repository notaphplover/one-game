import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RegisterConfirm } from './RegisterConfirm';
import {
  STATUS_FULFILLED,
  STATUS_REJECTED,
  UNEXPECTED_ERROR_MESSAGE,
  useRegisterConfirm,
} from '../hooks/useRegisterConfirm';

jest.mock('../hooks/useRegisterConfirm');

describe(RegisterConfirm.name, () => {
  describe('when called, and useRegisterConfirm() returns a fulfilled status', () => {
    let confirmRegisterOkGridDisplayValue;

    beforeAll(() => {
      useRegisterConfirm.mockReturnValue({
        status: STATUS_FULFILLED,
        errorMessage: null,
      });

      render(
        <MemoryRouter>
          <RegisterConfirm />
        </MemoryRouter>,
      );

      const confirmRegisterOkGrid = screen.getByLabelText(
        'confirm-register-ok',
      );

      confirmRegisterOkGridDisplayValue = window
        .getComputedStyle(confirmRegisterOkGrid)
        .getPropertyValue('display');
    });

    it('should show the success grid', () => {
      expect(confirmRegisterOkGridDisplayValue).not.toBe('none');
    });

    afterAll(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });
  });

  describe('when called, and useRegisterConfirm() returns a rejected status', () => {
    let confirmRegisterErrorGridDisplayValue;

    beforeAll(() => {
      useRegisterConfirm.mockReturnValue({
        status: STATUS_REJECTED,
        errorMessage: UNEXPECTED_ERROR_MESSAGE,
      });

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

    it('should call hook useRegisterConfirm() was called once with certain arguments (no args in this case)', () => {
      expect(useRegisterConfirm).toHaveBeenCalledTimes(1);
      expect(useRegisterConfirm).toHaveBeenCalledWith();
    });

    afterAll(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });
  });
});
