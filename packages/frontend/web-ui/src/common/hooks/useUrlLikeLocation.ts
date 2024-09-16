import { useLocation } from 'react-router-dom';

import { UrlLikeLocation } from '../models/UrlLikeLocation';

export const useUrlLikeLocation = (): UrlLikeLocation => {
  return new UrlLikeLocation(useLocation());
};
