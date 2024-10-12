import { useEffect, useState } from 'react';
import { clearInterval, setInterval } from 'worker-timers';

const MS_PER_SECOND: number = 1000;

export interface UseCountdownParams {
  durationSeconds: number;
}

export interface UseCountdownResult {
  currentSeconds: number;
  durationSeconds: number;
  isRunning: boolean;
  start: (seconds?: number) => void;
  stop: () => void;
}

function isNatural(number: number): boolean {
  return number > 0 && number === Math.floor(number);
}

export const useCountdown = (
  params: UseCountdownParams,
): UseCountdownResult => {
  const [currentSeconds, setCurrentSeconds] = useState(params.durationSeconds);
  const [timerId, setTimerId] = useState<number>();

  if (!isNatural(params.durationSeconds)) {
    throw new Error(
      'Unable to initialize hook: durationSeconds must be a natural number',
    );
  }

  const start: (seconds?: number) => void = (seconds?: number): void => {
    if (seconds !== undefined) {
      const naturalSeconds: number = Math.min(
        params.durationSeconds,
        Math.max(1, Math.floor(seconds)),
      );

      setCurrentSeconds(naturalSeconds);
    }

    if (timerId !== undefined) {
      clearInterval(timerId);
    }

    setTimerId(
      setInterval(() => {
        setCurrentSeconds((seconds: number): number => seconds - 1);
      }, MS_PER_SECOND),
    );
  };

  const stop: () => void = (): void => {
    if (timerId !== undefined) {
      clearInterval(timerId);
      setCurrentSeconds(params.durationSeconds);
      setTimerId(undefined);
    }
  };

  useEffect(() => {
    if (currentSeconds === 0) {
      stop();
    }
  }, [currentSeconds]);

  return {
    currentSeconds,
    durationSeconds: params.durationSeconds,
    isRunning: timerId !== undefined,
    start,
    stop,
  };
};
