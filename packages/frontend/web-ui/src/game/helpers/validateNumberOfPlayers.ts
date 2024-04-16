import { Either } from '../../common/models/Either';
import {
  NUMBER_PLAYERS_MAXIMUM,
  NUMBER_PLAYERS_MINIMUM,
} from './numberOfPlayersValues';

export const validateNumberOfPlayers = (
  numberOfPlayers: number,
): Either<string, undefined> => {
  if (
    numberOfPlayers < NUMBER_PLAYERS_MINIMUM ||
    numberOfPlayers > NUMBER_PLAYERS_MAXIMUM
  ) {
    return {
      isRight: false,
      value: `Invalid number of players. It must be from ${NUMBER_PLAYERS_MINIMUM} to ${NUMBER_PLAYERS_MAXIMUM} players.`,
    };
  } else {
    return {
      isRight: true,
      value: undefined,
    };
  }
};
