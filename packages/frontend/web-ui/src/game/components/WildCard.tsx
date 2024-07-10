import { models as apiModels } from '@cornie-js/api-models';

import { getImageCardUrl } from '../helpers/getImageCardUrl';
import { ImageCard } from './ImageCard';

export interface WildCardOptions {
  card: apiModels.WildCardV1;
  colorClass: 'white-color';
}

export const WildCard = (params: WildCardOptions) => {
  return (
    <ImageCard
      image={getImageCardUrl(params.card)}
      colorClass={params.colorClass}
    ></ImageCard>
  );
};
