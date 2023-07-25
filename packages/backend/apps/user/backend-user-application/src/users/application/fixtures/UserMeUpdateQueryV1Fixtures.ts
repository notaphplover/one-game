import { models as apiModels } from '@cornie-js/api-models';

export class UserMeUpdateQueryV1Fixtures {
  public static get any(): apiModels.UserMeUpdateQueryV1 {
    return {};
  }

  public static get withActive(): apiModels.UserMeUpdateQueryV1 {
    return {
      ...UserMeUpdateQueryV1Fixtures.any,
      active: true,
    };
  }

  public static get withName(): apiModels.UserMeUpdateQueryV1 {
    return {
      ...UserMeUpdateQueryV1Fixtures.any,
      name: 'Name',
    };
  }
}
