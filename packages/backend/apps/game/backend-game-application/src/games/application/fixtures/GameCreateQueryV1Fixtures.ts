import { models as apiModels } from '@cornie-js/api-models';

import { GameOptionsV1Fixtures } from './GameOptionsV1Fixtures';

export class GameCreateQueryV1Fixtures {
  public static get any(): apiModels.GameCreateQueryV1 {
    return {
      gameSlotsAmount: 3,
      options: GameOptionsV1Fixtures.any,
    };
  }

  public static get withIsPublicTrue(): apiModels.GameCreateQueryV1 {
    return {
      ...GameCreateQueryV1Fixtures.any,
      isPublic: true,
    };
  }

  public static get withNoIsPublic(): apiModels.GameCreateQueryV1 {
    const fixture: apiModels.GameCreateQueryV1 = GameCreateQueryV1Fixtures.any;

    delete fixture.isPublic;

    return fixture;
  }
}
