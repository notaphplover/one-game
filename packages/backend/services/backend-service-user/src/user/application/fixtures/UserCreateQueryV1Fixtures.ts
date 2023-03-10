import { models as apiModels } from '@one-game-js/api-models';

export class UserCreateQueryV1Fixtures {
  public static get any(): apiModels.UserCreateQueryV1 {
    const fixture: apiModels.UserCreateQueryV1 = {
      email: 'mail@example.com',
      name: 'name',
      password: 'sample input',
    };

    return fixture;
  }
}
