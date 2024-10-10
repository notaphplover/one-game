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
  start: () => void;
  stop: () => void;
}

export const useCountdown = (
  params: UseCountdownParams,
): UseCountdownResult => {
  const [currentSeconds, setCurrentSeconds] = useState(params.durationSeconds);
  const [timerId, setTimerId] = useState<number>();

  if (
    params.durationSeconds <= 0 ||
    params.durationSeconds !== Math.floor(params.durationSeconds)
  ) {
    throw new Error(
      'Unable to initialize hook: durationSeconds must be a natural number',
    );
  }

  const start: () => void = (): void => {
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
