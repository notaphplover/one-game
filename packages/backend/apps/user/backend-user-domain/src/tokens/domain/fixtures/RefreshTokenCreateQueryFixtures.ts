import { RefreshTokenCreateQuery } from '../queries/RefreshTokenCreateQuery';

export class RefreshTokenCreateQueryFixtures {
  public static get any(): RefreshTokenCreateQuery {
    return {
      active: true,
      family: 'family-fixture',
      id: 'f3073aec-b81b-4107-97f9-baa46de5d441',
      token: 'token-fixture',
    };
  }
}
