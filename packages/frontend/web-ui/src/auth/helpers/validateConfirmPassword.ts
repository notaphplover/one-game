import { PASSWORD_MIN_LENGTH } from '../../common/helpers/passwordMinLength';
import { Either } from '../../common/models/Either';

export const validateConfirmPassword = (
  password: string | null | undefined,
  confirmPassword: string,
): Either<string[], undefined> => {
  const errorMessages: string[] = [];

  if (confirmPassword.length < PASSWORD_MIN_LENGTH) {
    errorMessages.push(
      `Password must be of minimum ${PASSWORD_MIN_LENGTH.toString()} characters length.`,
    );
  }

  if ((password ?? '').trim() !== confirmPassword.trim()) {
    errorMessages.push('Confirm password must match the password.');
  }

  if (errorMessages.length !== 0) {
    return {
      isRight: false,
      value: errorMessages,
    };
  } else {
    return {
      isRight: true,
      value: undefined,
    };
  }
};
