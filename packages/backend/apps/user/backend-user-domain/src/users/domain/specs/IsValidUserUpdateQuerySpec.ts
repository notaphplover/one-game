import { Either, ReportBasedSpec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { UserUpdateQuery } from '../query/UserUpdateQuery';

@Injectable()
export class IsValidUserUpdateQuerySpec
  implements ReportBasedSpec<[UserUpdateQuery], string[]>
{
  public isSatisfiedOrReport(
    userUpdateQuery: UserUpdateQuery,
  ): Either<string[], undefined> {
    const errors: string[] = [];

    if (
      userUpdateQuery.name !== undefined &&
      userUpdateQuery.name.trim().length === 0
    ) {
      errors.push('Expected a non empty name');
    }

    return errors.length === 0
      ? {
          isRight: true,
          value: undefined,
        }
      : {
          isRight: false,
          value: errors,
        };
  }
}
