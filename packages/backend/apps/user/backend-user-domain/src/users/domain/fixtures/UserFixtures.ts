import { User } from '../models/User';

export class UserFixtures {
  public static get any(): User {
    const fixture: User = {
      active: true,
      email: 'mail@sample.com',
      id: '83073aec-b81b-4107-97f9-baa46de5dd40',
      name: 'Name',
      passwordHash:
        '$2y$10$/Q/7HB2eWCzGILadcebdf.8fvya0/cnYkPdgy4q63K3IGdlnpc.7K',
    };

    return fixture;
  }

  public static get withActiveFalse(): User {
    return {
      ...UserFixtures.any,
      active: false,
    };
  }

  public static get withActiveTrue(): User {
    return {
      ...UserFixtures.any,
      active: true,
    };
  }
}
