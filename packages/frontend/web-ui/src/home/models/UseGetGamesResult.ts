import { Either } from '../../common/models/Either';
import { models as apiModels } from '@cornie-js/api-models';

export type GameState = apiModels.GameV1['state']['status'];

export interface UseGetGamesParams {
  pageNumber: number;
  status: GameState | null;
}

export interface UseGetGamesResult {
  call: (params: UseGetGamesParams) => void;
  result: Either<string, apiModels.GameArrayV1> | null;
}
