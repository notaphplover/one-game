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
    let successElement: HTMLElement | null;

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

      successElement = renderResult.container.querySelector(
        '.join-existing-game-success',
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useRedirectUnauthorized()', () => {
      expect(useRedirectUnauthorized).toHaveBeenCalledTimes(1);
      expect(useRedirectUnauthorized).toHaveBeenCalledWith();
    });

    it('should show the success grid', () => {
      expect(successElement).not.toBeNull();
    });
  });

  describe('when called, and useJoinExistingGame returns a rejected result', () => {
    let failureElement: HTMLElement | null;

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

      failureElement = renderResult.container.querySelector(
        '.join-existing-game-error',
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useRedirectUnauthorized()', () => {
      expect(useRedirectUnauthorized).toHaveBeenCalledTimes(1);
      expect(useRedirectUnauthorized).toHaveBeenCalledWith();
    });

    it('should show the rejected grid', () => {
      expect(failureElement).not.toBeNull();
    });
  });
});
