import {
  NUMBER_PLAYERS_MAXIMUM,
  NUMBER_PLAYERS_MINIMUM,
} from '../../common/helpers/numberOfPlayersValues';

export function setFormFieldValue(
  fieldName: string,
  fieldValue: string,
): string | number {
  let finalValue: string | number;

  if (fieldName === 'name') {
    if (fieldValue.trim() !== '') {
      finalValue = fieldValue;
    } else {
      finalValue = '';
    }
  } else {
    const value: number = parseInt(fieldValue);
    let numberOfPlayers: number;

    if (value < NUMBER_PLAYERS_MINIMUM) {
      numberOfPlayers = NUMBER_PLAYERS_MINIMUM;
    } else {
      if (value >= NUMBER_PLAYERS_MAXIMUM) {
        numberOfPlayers = NUMBER_PLAYERS_MAXIMUM;
      } else {
        numberOfPlayers = value;
      }
    }
    finalValue = numberOfPlayers;
  }
  return finalValue;
}
