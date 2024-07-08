import { models as apiModels } from '@cornie-js/api-models';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCard } from '../helpers/getImageCard';
import { ImageCard } from './ImageCard';

export interface DrawCardOptions {
  card: apiModels.DrawCardV1;
}

export const DrawCard = (params: DrawCardOptions) => {
  return (
    <ImageCard
      image={getImageCard(params.card.kind)}
      colorClass={getCardColorClassName(params.card.color)}
    ></ImageCard>
  );
};
