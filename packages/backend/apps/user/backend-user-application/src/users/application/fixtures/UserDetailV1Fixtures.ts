import { models as apiModels } from '@cornie-js/api-models';

export class UserDetailV1Fixtures {
  public static get any(): apiModels.UserDetailV1 {
    const fixture: apiModels.UserDetailV1 = {
      email: 'mail@sample.com',
    };

    return fixture;
  }
}
