import { useLocation } from 'react-router';

import { UrlLikeLocation } from '../models/UrlLikeLocation';

export const useUrlLikeLocation = (): UrlLikeLocation => {
  return new UrlLikeLocation(useLocation());
};
