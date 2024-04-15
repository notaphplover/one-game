import { Either } from '../../common/models/Either';

export const validateNumberOfPlayers = (
  numberOfPlayers: number | undefined,
): Either<string, undefined> => {
  if (
    numberOfPlayers === undefined ||
    numberOfPlayers < 2 ||
    numberOfPlayers > 10
  ) {
    return {
      isRight: false,
      value: "Please, fill it out. At least, it's necessary 2 players.",
    };
  } else {
    return {
      isRight: true,
      value: undefined,
    };
  }
};
