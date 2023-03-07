import { models as apiModels } from '@one-game-js/backend-api-models';

export class UserV1Fixtures {
  public static get any(): apiModels.UserV1 {
    const fixture: apiModels.UserV1 = {
      id: '83073aec-b81b-4107-97f9-baa46de5dd40',
      name: 'Name',
    };

    return fixture;
  }
}
