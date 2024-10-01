import { models as apiModels } from '@cornie-js/api-models';

export function cloneGame(game: apiModels.ActiveGameV1): apiModels.ActiveGameV1;
export function cloneGame(
  game: apiModels.FinishedGameV1,
): apiModels.FinishedGameV1;
export function cloneGame(
  game: apiModels.ActiveGameV1 | apiModels.FinishedGameV1,
): apiModels.ActiveGameV1 | apiModels.FinishedGameV1;
export function cloneGame(
  game: apiModels.ActiveGameV1 | apiModels.FinishedGameV1,
): apiModels.ActiveGameV1 | apiModels.FinishedGameV1 {
  switch (game.state.status) {
    case 'active':
      return {
        ...game,
        state: {
          ...game.state,
          slots: game.state.slots.map(
            (slot: apiModels.ActiveGameSlotV1): apiModels.ActiveGameSlotV1 => ({
              ...slot,
            }),
          ),
        },
      };
    case 'finished':
      return {
        ...game,
        state: {
          ...game.state,
          slots: game.state.slots.map(
            (slot: apiModels.ActiveGameSlotV1): apiModels.ActiveGameSlotV1 => ({
              ...slot,
            }),
          ),
        },
      };
  }
}
