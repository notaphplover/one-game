import { models as apiModels } from '@cornie-js/api-models';

export function getGameSlotIndex(
  game: apiModels.GameV1 | undefined,
  user: apiModels.UserV1,
): string | null {
  if (game === undefined) {
    return null;
  }

  for (let i: number = 0; i < game.state.slots.length; ++i) {
    const gameSlot: apiModels.ActiveGameSlotV1 | apiModels.FinishedGameSlotV1 =
      game.state.slots[i] as
        | apiModels.ActiveGameSlotV1
        | apiModels.FinishedGameSlotV1;

    if (gameSlot.userId === user.id) {
      return i.toString();
    }
  }

  return null;
}
