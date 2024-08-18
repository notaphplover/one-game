import { Either } from '../../common/models/Either';

export const validateEmail = (email: string): Either<string, undefined> => {
  if (email.match(/^\S+@\S+$/gi) == null) {
    return {
      isRight: false,
      value: 'The email must be a valid email.',
    };
  } else {
    return {
      isRight: true,
      value: undefined,
    };
  }
};
