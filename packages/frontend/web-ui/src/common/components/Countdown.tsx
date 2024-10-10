import { Box, CircularProgress, Typography } from '@mui/material';

const PERCENTAGE_FACTOR: number = 100;

export interface CountdownOnParams {
  currentSeconds: number;
  durationSeconds: number;
}

export type CountdownOffParams = object;

export type CountdownParams = CountdownOnParams | CountdownOffParams;

function isCountdownOnParams(
  params: CountdownParams,
): params is CountdownOnParams {
  return (params as Partial<CountdownOnParams>).currentSeconds !== undefined;
}

export const Countdown = (params: CountdownParams): React.JSX.Element => {
  let progressValue: number;
  let countdownText: string;

  if (isCountdownOnParams(params)) {
    progressValue =
      (PERCENTAGE_FACTOR * params.currentSeconds) / params.durationSeconds;
    countdownText = params.currentSeconds.toString();
  } else {
    progressValue = PERCENTAGE_FACTOR;
    countdownText = '-';
  }

  return (
    <Box className="countdown-container">
      <Box className="countdown-progress-container">
        <CircularProgress
          color="primary"
          value={progressValue}
          variant="determinate"
        />
      </Box>
      <Box className="countdown-text-container">
        <Typography className="countdown-text">{countdownText}</Typography>
      </Box>
    </Box>
  );
};
