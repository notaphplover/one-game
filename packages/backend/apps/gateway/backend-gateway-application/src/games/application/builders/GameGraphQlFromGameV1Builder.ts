import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GameGraphQlFromGameV1Builder
  implements Builder<graphqlModels.Game, [apiModels.GameV1]>
{
  public build(gameV1: apiModels.GameV1): graphqlModels.Game {
    switch (gameV1.state.status) {
      case 'active':
        return this.#buildActiveGame(gameV1 as apiModels.ActiveGameV1);
      case 'finished':
        return this.#buildFinishedGame(gameV1 as apiModels.FinishedGameV1);
      case 'nonStarted': {
        return this.#buildNonStartedGame(gameV1 as apiModels.NonStartedGameV1);
      }
    }
  }

  #buildActiveGame(gameV1: apiModels.ActiveGameV1): graphqlModels.ActiveGame {
    const activeGame: graphqlModels.ActiveGame = {
      id: gameV1.id,
      name: gameV1.name ?? null,
      state: gameV1.state,
    };

    return activeGame;
  }

  #buildFinishedGame(
    gameV1: apiModels.FinishedGameV1,
  ): graphqlModels.FinishedGame {
    const finishedGame: graphqlModels.FinishedGame = {
      id: gameV1.id,
      name: gameV1.name ?? null,
      state: gameV1.state,
    };

    return finishedGame;
  }

  #buildNonStartedGame(
    gameV1: apiModels.NonStartedGameV1,
  ): graphqlModels.NonStartedGame {
    const nonStartedGame: graphqlModels.NonStartedGame = {
      id: gameV1.id,
      name: gameV1.name ?? null,
      state: gameV1.state,
    };

    return nonStartedGame;
  }
}
