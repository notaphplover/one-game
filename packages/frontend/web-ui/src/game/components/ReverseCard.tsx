import { models as apiModels } from '@cornie-js/api-models';
import { MouseEvent } from 'react';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { ImageCard } from './ImageCard';

export interface ReverseCardOptions {
  card: apiModels.ReverseCardV1;
  onDoubleClick?: ((event: MouseEvent) => void) | undefined;
}

export const ReverseCard = (params: ReverseCardOptions) => {
  return (
    <ImageCard
      image={getImageCardUrl(params.card)}
      colorClass={getCardColorClassName(params.card.color)}
      onDoubleClick={params.onDoubleClick}
    ></ImageCard>
  );
};
