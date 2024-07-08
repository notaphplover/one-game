import { models as apiModels } from '@cornie-js/api-models';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCard } from '../helpers/getImageCard';
import { ImageCard } from './ImageCard';

export interface SkipCardOptions {
  card: apiModels.SkipCardV1;
}

export const SkipCard = (params: SkipCardOptions) => {
  return (
    <ImageCard
      image={getImageCard(params.card.kind)}
      colorClass={getCardColorClassName(params.card.color)}
    ></ImageCard>
  );
};
