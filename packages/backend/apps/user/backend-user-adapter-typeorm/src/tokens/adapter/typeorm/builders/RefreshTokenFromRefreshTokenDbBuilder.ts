import { Builder } from '@cornie-js/backend-common';
import { RefreshToken } from '@cornie-js/backend-user-domain/tokens';
import { Injectable } from '@nestjs/common';

import { RefreshTokenDb } from '../models/RefreshTokenDb';

@Injectable()
export class RefreshTokenFromRefreshTokenDbBuilder
  implements Builder<RefreshToken, [RefreshTokenDb]>
{
  public build(refreshTokenDb: RefreshTokenDb): RefreshToken {
    return {
      token: refreshTokenDb.token,
    };
  }
}
