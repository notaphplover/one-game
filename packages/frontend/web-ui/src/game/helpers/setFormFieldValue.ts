import {
  NUMBER_PLAYERS_MAXIMUM,
  NUMBER_PLAYERS_MINIMUM,
} from './numberOfPlayersValues';

export function setFormFieldValue(
  fieldName: string,
  fieldValue: string | undefined,
): string | undefined {
  let finalValue: string | undefined;

  if (fieldValue === undefined) {
    finalValue = undefined;
  } else {
    if (fieldName === 'name') {
      if (fieldValue.trim() !== '') {
        finalValue = fieldValue;
      } else {
        finalValue = undefined;
      }
    } else {
      const value: number = parseInt(fieldValue);
      let numberOfPlayers: string;

      if (value < NUMBER_PLAYERS_MINIMUM) {
        numberOfPlayers = NUMBER_PLAYERS_MINIMUM.toString();
      } else {
        if (value >= NUMBER_PLAYERS_MAXIMUM) {
          numberOfPlayers = NUMBER_PLAYERS_MAXIMUM.toString();
        } else {
          numberOfPlayers = fieldValue;
        }
      }
      finalValue = numberOfPlayers;
    }
  }

  return finalValue;
}
