import { RefreshToken } from '../valueObjects/RefreshToken';

export class RefreshTokenFixtures {
  public static get any(): RefreshToken {
    return {
      token: 'refresh-token-fixture',
    };
  }
}
