import { models as apiModels } from '@cornie-js/api-models';

import { getCardColorClassName } from '../helpers/getCardColorClassName';
import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { ImageCard } from './ImageCard';

export interface ReverseCardOptions {
  card: apiModels.ReverseCardV1;
}

export const ReverseCard = (params: ReverseCardOptions) => {
  return (
    <ImageCard
      image={getImageCardUrl(params.card)}
      colorClass={getCardColorClassName(params.card.color)}
    ></ImageCard>
  );
};
