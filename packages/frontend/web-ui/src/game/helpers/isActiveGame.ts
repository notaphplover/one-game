import { models as apiModels } from '@cornie-js/api-models';

export function isActiveGame(
  game: apiModels.GameV1 | undefined,
): game is apiModels.ActiveGameV1 {
  return game?.state.status === 'active';
}
