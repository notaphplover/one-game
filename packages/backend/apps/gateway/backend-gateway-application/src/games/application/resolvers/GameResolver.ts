import { models as graphqlModels } from '@cornie-js/api-graphql-models';
import { Injectable } from '@nestjs/common';

import { Context } from '../../../foundation/graphql/application/models/Context';

type GameResolvedType = ReturnType<GameResolver['__resolveType']>;

const GAME_STATUS_TO_GAME_RESOLVED_TYPE: {
  [TKey in graphqlModels.Game['state']['status']]: GameResolvedType;
} = {
  active: 'ActiveGame',
  finished: 'FinishedGame',
  nonStarted: 'NonStartedGame',
};

@Injectable()
export class GameResolver implements graphqlModels.GameResolvers<Context> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public __resolveType(
    game: graphqlModels.Game,
  ): 'ActiveGame' | 'FinishedGame' | 'NonStartedGame' {
    return GAME_STATUS_TO_GAME_RESOLVED_TYPE[game.state.status];
  }
}
