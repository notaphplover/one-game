import { Converter } from '@cornie-js/backend-common';
import { UserCode } from '@cornie-js/backend-user-domain/users';
import { Injectable } from '@nestjs/common';

import { UserCodeDb } from '../models/UserCodeDb';

@Injectable()
export class UserCodeDbToUserCodeConverter
  implements Converter<UserCodeDb, UserCode>
{
  public convert(userCodeDb: UserCodeDb): UserCode {
    return {
      code: userCodeDb.code,
    };
  }
}
