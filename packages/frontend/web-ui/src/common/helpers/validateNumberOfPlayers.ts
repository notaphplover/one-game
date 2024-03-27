import { Either } from '../models/Either';

export const validateNumberOfPlayers = (
  numberOfPlayers: number,
): Either<string, undefined> => {
  if (isNaN(numberOfPlayers)) {
    return {
      isRight: false,
      value: "It's necessary at least 2 players.",
    };
  } else {
    return {
      isRight: true,
      value: undefined,
    };
  }
};
