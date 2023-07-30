import { Either, ReportBasedSpec } from '@cornie-js/backend-common';
import { Injectable } from '@nestjs/common';

import { UserCreateQuery } from '../query/UserCreateQuery';

const EMAIL_REGEXP: RegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

@Injectable()
export class IsValidUserCreateQuerySpec
  implements ReportBasedSpec<[UserCreateQuery], string[]>
{
  public isSatisfiedOrReport(
    userCreateQuery: UserCreateQuery,
  ): Either<string[], undefined> {
    const errors: string[] = [];

    if (!EMAIL_REGEXP.test(userCreateQuery.email)) {
      errors.push(`"${userCreateQuery.email}" is not a valid email`);
    }

    if (userCreateQuery.name.trim().length === 0) {
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
