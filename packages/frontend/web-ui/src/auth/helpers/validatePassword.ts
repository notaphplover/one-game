import { PASSWORD_MIN_LENGTH } from '../../common/helpers/passwordMinLength';
import { Either } from '../../common/models/Either';

export const validatePassword = (
  password: string,
): Either<string, undefined> => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      isRight: false,
      value: `Password must be of minimum ${PASSWORD_MIN_LENGTH.toString()} characters length`,
    };
  } else {
    return {
      isRight: true,
      value: undefined,
    };
  }
};
