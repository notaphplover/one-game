import { UserCreateQuery } from '../query/UserCreateQuery';

export class UserCreateQueryFixtures {
  public static get any(): UserCreateQuery {
    const fixture: UserCreateQuery = {
      active: false,
      email: 'mail@example.com',
      id: '83073aec-b81b-4107-97f9-baa46de5dd40',
      name: 'Name',
      passwordHash:
        '$2y$10$/Q/7HB2eWCzGILadcebdf.8fvya0/cnYkPdgy4q63K3IGdlnpc.7K',
    };

    return fixture;
  }

  public static get withEmailInvalid(): UserCreateQuery {
    return {
      ...UserCreateQueryFixtures.any,
      email: 'thisi$notanemail',
    };
  }

  public static get withNameEmpty(): UserCreateQuery {
    return {
      ...UserCreateQueryFixtures.any,
      name: '',
    };
  }
}
