import { models as apiModels } from '@cornie-js/api-models';

import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { ImageCard } from './ImageCard';

export interface WildDraw4CardOptions {
  card: apiModels.WildDraw4CardV1;
  colorClass: 'white-color';
}

export const WildDraw4Card = (params: WildDraw4CardOptions) => {
  return (
    <ImageCard
      image={getImageCardUrl(params.card)}
      colorClass={params.colorClass}
    ></ImageCard>
  );
};
