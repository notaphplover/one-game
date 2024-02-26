import { Either } from '../models/Either';

export const validateName = (name: string): Either<string, undefined> => {
  if (name.trim() === '') {
    return {
      isRight: false,
      value: 'The name is mandatory.',
    };
  } else {
    return {
      isRight: true,
      value: undefined,
    };
  }
};
