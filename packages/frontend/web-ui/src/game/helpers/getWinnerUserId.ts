import { models as apiModels } from '@cornie-js/api-models';

export function getWinnerUserId(
  game: apiModels.GameV1 | undefined,
): string | undefined {
  let selectedUserId: string | undefined = undefined;

  if (game?.state.status === 'finished') {
    game.state.slots.forEach((finishGameSlot: apiModels.FinishedGameSlotV1) => {
      if (finishGameSlot.cardsAmount === 0) {
        selectedUserId = finishGameSlot.userId;
      }
    });
  }
  return selectedUserId;
}
