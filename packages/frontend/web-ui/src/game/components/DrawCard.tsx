import { models as apiModels } from '@cornie-js/api-models';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { ImageCard } from './ImageCard';

export interface DrawCardOptions {
  card: apiModels.DrawCardV1;
}

export const DrawCard = (params: DrawCardOptions) => {
  return (
    <ImageCard
      image={getImageCardUrl(params.card)}
      colorClass={getCardColorClassName(params.card.color)}
    ></ImageCard>
  );
};
