import { Either } from '../../common/models/Either';

export const validateUsername = (
  username: string,
): Either<string, undefined> => {
  if (username.trim() === '') {
    return {
      isRight: false,
      value: 'Name is mandatory.',
    };
  } else {
    return {
      isRight: true,
      value: undefined,
    };
  }
};
