import { beforeAll, describe, expect, it } from '@jest/globals';

import { RenderHookResult, renderHook } from '@testing-library/react';
import { act } from 'react';

import useConsecutiveSnackbars, {
  UseConsecutiveSnackBarResult,
} from './useConsecutiveSnackbars';

describe(useConsecutiveSnackbars.name, () => {
  describe('when called', () => {
    let renderResult: RenderHookResult<UseConsecutiveSnackBarResult, unknown>;

    beforeAll(() => {
      renderResult = renderHook(() => useConsecutiveSnackbars());
    });

    it('should return expected result', () => {
      const expected: UseConsecutiveSnackBarResult = {
        close: expect.any(Function) as unknown as () => void,
        dequeue: expect.any(Function) as unknown as () => void,
        enqueue: expect.any(Function) as unknown as (
          messageContent: string,
        ) => void,
        message: undefined,
        open: false,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('when called, and enqueue() is called', () => {
    let renderResult: RenderHookResult<UseConsecutiveSnackBarResult, unknown>;

    let snackbarMessageContent: string;

    beforeAll(async () => {
      snackbarMessageContent = 'content-fixture';

      renderResult = renderHook(() => useConsecutiveSnackbars());

      act(() => {
        renderResult.result.current.enqueue(snackbarMessageContent);
      });
    });

    it('should return expected result', () => {
      const expected: UseConsecutiveSnackBarResult = {
        close: expect.any(Function) as unknown as () => void,
        dequeue: expect.any(Function) as unknown as () => void,
        enqueue: expect.any(Function) as unknown as (
          messageContent: string,
        ) => void,
        message: {
          content: snackbarMessageContent,
          key: expect.any(Number) as unknown as number,
        },
        open: true,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('when called, and enqueue() is called, and close() is called', () => {
    let renderResult: RenderHookResult<UseConsecutiveSnackBarResult, unknown>;

    let snackbarMessageContent: string;

    beforeAll(async () => {
      snackbarMessageContent = 'content-fixture';

      renderResult = renderHook(() => useConsecutiveSnackbars());

      act(() => {
        renderResult.result.current.enqueue(snackbarMessageContent);
      });

      act(() => {
        renderResult.result.current.close();
      });
    });

    it('should return expected result', () => {
      const expected: UseConsecutiveSnackBarResult = {
        close: expect.any(Function) as unknown as () => void,
        dequeue: expect.any(Function) as unknown as () => void,
        enqueue: expect.any(Function) as unknown as (
          messageContent: string,
        ) => void,
        message: {
          content: snackbarMessageContent,
          key: expect.any(Number) as unknown as number,
        },
        open: false,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });

  describe('when called, and enqueue() is called, and close() is called, and dequeue() is called', () => {
    let renderResult: RenderHookResult<UseConsecutiveSnackBarResult, unknown>;

    let snackbarMessageContent: string;

    beforeAll(async () => {
      snackbarMessageContent = 'content-fixture';

      renderResult = renderHook(() => useConsecutiveSnackbars());

      act(() => {
        renderResult.result.current.enqueue(snackbarMessageContent);
      });

      act(() => {
        renderResult.result.current.close();
      });

      act(() => {
        renderResult.result.current.dequeue();
      });
    });

    it('should return expected result', () => {
      const expected: UseConsecutiveSnackBarResult = {
        close: expect.any(Function) as unknown as () => void,
        dequeue: expect.any(Function) as unknown as () => void,
        enqueue: expect.any(Function) as unknown as (
          messageContent: string,
        ) => void,
        message: undefined,
        open: false,
      };

      expect(renderResult.result.current).toStrictEqual(expected);
    });
  });
});
