import { models as apiModels } from '@cornie-js/api-models';

export function userCanJoinGame(
  game: apiModels.GameV1,
  user: apiModels.UserV1 | undefined,
): boolean {
  return (
    user !== undefined &&
    game.state.status === 'nonStarted' &&
    !game.state.slots.some(
      (slot: apiModels.NonStartedGameSlotV1): boolean =>
        slot.userId === user.id,
    )
  );
}
