import { Spec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { GameFindQuery } from '../query/GameFindQuery';

@Injectable()
export class GamesCanBeFoundByUserSpec implements Spec<[GameFindQuery]> {
  public isSatisfiedBy(gameFindQuery: GameFindQuery): boolean {
    return gameFindQuery.isPublic === true;
  }
}
