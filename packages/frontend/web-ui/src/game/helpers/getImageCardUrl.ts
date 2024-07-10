import { models as apiModels } from '@cornie-js/api-models';

import drawCardImageUrl from '../../app/images/cards/draw.svg';
import reverseCardImageUrl from '../../app/images/cards/reverse.svg';
import skipCardImageUrl from '../../app/images/cards/skip.svg';
import wildCardImageUrl from '../../app/images/cards/wild.svg';
import wildDraw4CardImageUrl from '../../app/images/cards/wildDraw4.svg';

export function getImageCardUrl(card: apiModels.CardV1): string {
  let imageUrl: string;

  switch (card.kind) {
    case 'draw':
      imageUrl = drawCardImageUrl;
      break;
    case 'normal':
      imageUrl = '';
      break;
    case 'reverse':
      imageUrl = reverseCardImageUrl;
      break;
    case 'skip':
      imageUrl = skipCardImageUrl;
      break;
    case 'wild':
      imageUrl = wildCardImageUrl;
      break;
    case 'wildDraw4':
      imageUrl = wildDraw4CardImageUrl;
      break;
  }

  return imageUrl;
}
