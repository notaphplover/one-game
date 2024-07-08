import { models as apiModels } from '@cornie-js/api-models';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCard } from '../helpers/getImageCard';
import { ImageCard } from './ImageCard';

export interface ReverseCardOptions {
  card: apiModels.ReverseCardV1;
}

export const ReverseCard = (params: ReverseCardOptions) => {
  return (
    <ImageCard
      image={getImageCard(params.card.kind)}
      colorClass={getCardColorClassName(params.card.color)}
    ></ImageCard>
  );
};
