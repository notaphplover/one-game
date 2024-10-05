import { models as apiModels } from '@cornie-js/api-models';

export function isFinishedGame(
  game: apiModels.GameV1 | undefined,
): game is apiModels.FinishedGameV1 {
  return game?.state.status === 'finished';
}
