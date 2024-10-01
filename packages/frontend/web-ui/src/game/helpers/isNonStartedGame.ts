import { models as apiModels } from '@cornie-js/api-models';

export function isNonStartedGame(
  game: apiModels.GameV1 | undefined,
): game is apiModels.NonStartedGameV1 {
  return game?.state.status === 'nonStarted';
}
