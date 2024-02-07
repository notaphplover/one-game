import { Either } from '../models/Either';
import { PASSWORD_MIN_LENGTH } from './passwordMinLength';

export const validatePassword = (
  password: string,
): Either<string, undefined> => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      isRight: false,
      value: `Password must be of minimum ${PASSWORD_MIN_LENGTH} characters length`,
    };
  } else {
    return {
      isRight: true,
      value: undefined,
    };
  }
};
