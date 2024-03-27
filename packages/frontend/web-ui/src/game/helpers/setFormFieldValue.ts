import {
  NUMBER_PLAYERS_MAXIMUM,
  NUMBER_PLAYERS_MINIMUM,
} from '../../common/helpers/numberPlayersLength';

export function setFormFieldValue(fieldName: string, fieldValue: string) {
  let finalValue: string | number;

  if (fieldName === 'name') {
    if (fieldValue.trim() !== '') {
      finalValue = fieldValue;
    } else {
      finalValue = '';
    }
  } else {
    const value: number = parseInt(fieldValue);
    let newValue: number;

    if (value < NUMBER_PLAYERS_MINIMUM) {
      newValue = NUMBER_PLAYERS_MINIMUM;
    } else {
      if (value >= NUMBER_PLAYERS_MAXIMUM) {
        newValue = NUMBER_PLAYERS_MAXIMUM;
      } else {
        newValue = value;
      }
    }
    finalValue = newValue;
  }
  return finalValue;
}
