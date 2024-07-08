import { models as apiModels } from '@cornie-js/api-models';

import { getImageCard } from '../helpers/getImageCard';
import { ImageCard } from './ImageCard';

export interface WildCardOptions {
  card: apiModels.WildCardV1;
  colorClass: 'white-color';
}

export const WildCard = (params: WildCardOptions) => {
  return (
    <ImageCard
      image={getImageCard(params.card.kind)}
      colorClass={params.colorClass}
    ></ImageCard>
  );
};
