import { models as apiModels } from '@cornie-js/api-models';

import { getImageCard } from '../helpers/getImageCard';
import { ImageCard } from './ImageCard';

export interface WildDraw4CardOptions {
  card: apiModels.WildDraw4CardV1;
  colorClass: 'white-color';
}

export const WildDraw4Card = (params: WildDraw4CardOptions) => {
  return (
    <ImageCard
      image={getImageCard(params.card.kind)}
      colorClass={params.colorClass}
    ></ImageCard>
  );
};
