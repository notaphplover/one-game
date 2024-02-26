import { Writable } from '@cornie-js/backend-common';

import { RefreshTokenDb } from '../models/RefreshTokenDb';

export class RefreshTokenDbFixtures {
  public static get any(): RefreshTokenDb {
    const fixture: Writable<RefreshTokenDb> = new RefreshTokenDb();

    fixture.active = true;
    fixture.createdAt = new Date();
    fixture.family = 'family-fixture';
    fixture.id = 'f3073aec-b81b-4107-97f9-baa46de5d441';
    fixture.token = 'token-fixture';

    return fixture;
  }
}
