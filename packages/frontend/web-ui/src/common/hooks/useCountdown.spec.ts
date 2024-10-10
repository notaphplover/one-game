import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('worker-timers');

import { renderHook, RenderHookResult } from '@testing-library/react';
import { act } from 'react';
import { clearInterval, setInterval } from 'worker-timers';

import {
  useCountdown,
  UseCountdownParams,
  UseCountdownResult,
} from './useCountdown';

describe(useCountdown.name, () => {
  let timerIdFixture: number;

  beforeAll(() => {
    timerIdFixture = 2;

    (setInterval as jest.Mock<typeof setInterval>).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      (fn: Function): number => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        fn();

        return timerIdFixture;
      },
    );
  });

  describe('having params with 2 seconds', () => {
    let paramsFixture: UseCountdownParams;

    beforeAll(() => {
      paramsFixture = {
        durationSeconds: 2,
      };
    });

    describe('when called', () => {
      let renderResult: RenderHookResult<UseCountdownResult, unknown>;

      beforeAll(() => {
        renderResult = renderHook(() => useCountdown(paramsFixture));
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return UseCountdownResult', () => {
        const expected: UseCountdownResult = {
          currentSeconds: paramsFixture.durationSeconds,
          durationSeconds: paramsFixture.durationSeconds,
          isRunning: false,
          start: expect.any(Function) as unknown as () => void,
          stop: expect.any(Function) as unknown as () => void,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });

    describe('when called, and start() is called', () => {
      let renderResult: RenderHookResult<UseCountdownResult, unknown>;

      beforeAll(async () => {
        renderResult = renderHook(() => useCountdown(paramsFixture));

        act(() => {
          renderResult.result.current.start();
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should not call clearInterval()', () => {
        expect(clearInterval).not.toHaveBeenCalled();
      });

      it('should return UseCountdownResult', () => {
        const expected: UseCountdownResult = {
          currentSeconds: paramsFixture.durationSeconds - 1,
          durationSeconds: paramsFixture.durationSeconds,
          isRunning: true,
          start: expect.any(Function) as unknown as () => void,
          stop: expect.any(Function) as unknown as () => void,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });

  describe('having params with 1 second', () => {
    let paramsFixture: UseCountdownParams;

    beforeAll(() => {
      paramsFixture = {
        durationSeconds: 1,
      };
    });

    describe('when called', () => {
      let renderResult: RenderHookResult<UseCountdownResult, unknown>;

      beforeAll(() => {
        renderResult = renderHook(() => useCountdown(paramsFixture));
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return UseCountdownResult', () => {
        const expected: UseCountdownResult = {
          currentSeconds: paramsFixture.durationSeconds,
          durationSeconds: paramsFixture.durationSeconds,
          isRunning: false,
          start: expect.any(Function) as unknown as () => void,
          stop: expect.any(Function) as unknown as () => void,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });

    describe('when called, and start() is called', () => {
      let renderResult: RenderHookResult<UseCountdownResult, unknown>;

      beforeAll(async () => {
        renderResult = renderHook(() => useCountdown(paramsFixture));

        act(() => {
          renderResult.result.current.start();
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call clearInterval()', () => {
        expect(clearInterval).toHaveBeenCalledTimes(1);
        expect(clearInterval).toHaveBeenCalledWith(timerIdFixture);
      });

      it('should return UseCountdownResult', () => {
        const expected: UseCountdownResult = {
          currentSeconds: paramsFixture.durationSeconds,
          durationSeconds: paramsFixture.durationSeconds,
          isRunning: false,
          start: expect.any(Function) as unknown as () => void,
          stop: expect.any(Function) as unknown as () => void,
        };

        expect(renderResult.result.current).toStrictEqual(expected);
      });
    });
  });
});
