import { models as apiModels } from '@cornie-js/api-models';
import { MouseEvent } from 'react';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { ImageCard } from './ImageCard';

export interface ReverseCardOptions {
  card: apiModels.ReverseCardV1;
  isSelected?: boolean | undefined;
  onClick?: ((event: MouseEvent) => void) | undefined;
}

export const ReverseCard = (params: ReverseCardOptions) => {
  return (
    <ImageCard
      image={getImageCardUrl(params.card)}
      colorClass={getCardColorClassName(params.card.color)}
      isSelected={params.isSelected}
      onClick={params.onClick}
    ></ImageCard>
  );
};
