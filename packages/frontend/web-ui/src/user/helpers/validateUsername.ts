import { Either } from '../../common/models/Either';

export const validateUsername = (name: string): Either<string, undefined> => {
  if (name.trim() === '') {
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
