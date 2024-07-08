import { models as apiModels } from '@cornie-js/api-models';

export function getCardColorClassName(color: apiModels.CardColorV1): string {
  let cardColorClassName: string;

  switch (color) {
    case 'blue':
      cardColorClassName = 'blue-card';
      break;
    case 'green':
      cardColorClassName = 'green-card';
      break;
    case 'red':
      cardColorClassName = 'red-card';
      break;
    case 'yellow':
      cardColorClassName = 'yellow-card';
      break;
  }

  return cardColorClassName;
}
