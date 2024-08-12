import { models as apiModels } from '@cornie-js/api-models';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import { GameStatus } from '@cornie-js/backend-game-domain/games';
import { Injectable } from '@nestjs/common';

const GAME_V1_STATE_STATUS_TO_GAME_STATUS_MAP: {
  [TKey in apiModels.GameV1['state']['status']]: GameStatus;
} & { [key: string]: GameStatus } = {
  active: GameStatus.active,
  finished: GameStatus.finished,
  nonStarted: GameStatus.nonStarted,
};

@Injectable()
export class GameStatusFromGameV1StatusBuilder
  implements Builder<GameStatus, [string]>
{
  public build(gameStatusV1: string): GameStatus {
    const gameStatusOrUndefined: GameStatus | undefined =
      GAME_V1_STATE_STATUS_TO_GAME_STATUS_MAP[gameStatusV1];

    if (gameStatusOrUndefined === undefined) {
      const expectedValues: string[] = Object.keys(
        GAME_V1_STATE_STATUS_TO_GAME_STATUS_MAP,
      );

      throw new AppError(
        AppErrorKind.contractViolation,
        `Expected game status v1 to be one of the following values: ${expectedValues.join(
          ',',
        )}`,
      );
    }

    return gameStatusOrUndefined;
  }
}
