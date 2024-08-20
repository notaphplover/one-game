jest.mock('../../common/hooks/useRedirectUnauthorized');
jest.mock('../hooks/useJoinExistingGame');

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useRedirectUnauthorized } from '../../common/hooks/useRedirectUnauthorized';
import { useJoinExistingGame } from '../hooks/useJoinExistingGame';
import { JoinExistingGameStatus } from '../models/JoinExistingGameStatus';
import { JoinExistingGame } from './JoinExistingGame';

describe(JoinExistingGame.name, () => {
  describe('when called, and useJoinExistingGame returns a fulfilled status', () => {
    let joinExistingGameOkGridDisplayValue: string;

    beforeAll(async () => {
      (
        useJoinExistingGame as jest.Mock<typeof useJoinExistingGame>
      ).mockReturnValueOnce({
        errorMessage: null,
        status: JoinExistingGameStatus.fulfilled,
      });

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <JoinExistingGame />
        </MemoryRouter>,
      );

      const joinGameOkGrid: HTMLElement = renderResult.container.querySelector(
        '.join-existing-game-ok',
      ) as HTMLElement;

      joinExistingGameOkGridDisplayValue = window
        .getComputedStyle(joinGameOkGrid)
        .getPropertyValue('display');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useRedirectUnauthorized()', () => {
      expect(useRedirectUnauthorized).toHaveBeenCalledTimes(1);
      expect(useRedirectUnauthorized).toHaveBeenCalledWith();
    });

    it('should show the success grid', () => {
      expect(joinExistingGameOkGridDisplayValue).not.toBe('none');
    });
  });

  describe('when called, and useJoinExistingGame returns a fulfilled rejected', () => {
    let joinExistingGameKoGridDisplayValue: string;

    beforeAll(async () => {
      (
        useJoinExistingGame as jest.Mock<typeof useJoinExistingGame>
      ).mockReturnValueOnce({
        errorMessage: null,
        status: JoinExistingGameStatus.rejected,
      });

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <JoinExistingGame />
        </MemoryRouter>,
      );

      const joinGameKoGrid: HTMLElement = renderResult.container.querySelector(
        '.join-existing-game-error',
      ) as HTMLElement;

      joinExistingGameKoGridDisplayValue = window
        .getComputedStyle(joinGameKoGrid)
        .getPropertyValue('display');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useRedirectUnauthorized()', () => {
      expect(useRedirectUnauthorized).toHaveBeenCalledTimes(1);
      expect(useRedirectUnauthorized).toHaveBeenCalledWith();
    });

    it('should show the rejected grid', () => {
      expect(joinExistingGameKoGridDisplayValue).not.toBe('none');
    });
  });
});
