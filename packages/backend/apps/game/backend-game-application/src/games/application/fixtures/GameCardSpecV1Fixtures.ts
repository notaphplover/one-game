import { models as apiModels } from '@cornie-js/api-models';

import { CardV1Fixtures } from '../../../cards/application/fixtures/CardV1Fixtures';

export class GameCardSpecV1Fixtures {
  public static get any(): apiModels.GameCardSpecV1 {
    return {
      amount: 3,
      card: CardV1Fixtures.wildCard,
    };
  }
}
