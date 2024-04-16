import { Either } from '../../common/models/Either';
import {
  NUMBER_PLAYERS_MAXIMUM,
  NUMBER_PLAYERS_MINIMUM,
} from './numberOfPlayersValues';

export const validateNumberOfPlayers = (
  numberOfPlayers: number,
): Either<string, undefined> => {
  if (
    numberOfPlayers === undefined ||
    numberOfPlayers < NUMBER_PLAYERS_MINIMUM ||
    numberOfPlayers > NUMBER_PLAYERS_MAXIMUM
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
