import { models as apiModels } from '@cornie-js/api-models';
import { MouseEvent } from 'react';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { ImageCard } from './ImageCard';

export interface SkipCardOptions {
  card: apiModels.SkipCardV1;
  isSelected?: boolean | undefined;
  onClick?: ((event: MouseEvent) => void) | undefined;
}

export const SkipCard = (params: SkipCardOptions) => {
  return (
    <ImageCard
      image={getImageCardUrl(params.card)}
      colorClass={getCardColorClassName(params.card.color)}
      isSelected={params.isSelected}
      onClick={params.onClick}
    ></ImageCard>
  );
};
