import { useSingleAuthorizedApiCall } from '../../../common/hooks/useSingleAuthorizedApiCall';
import { buildErrorMessage } from './utils/buildErrorMessage';
import { buildRequestParams } from './utils/buildRequestParams';
import { buildResult } from './utils/buildResult';
import { useContext } from './utils/useContext';

export const useGetGames = () =>
  useSingleAuthorizedApiCall({
    buildErrorMessage,
    buildRequestParams,
    buildResult,
    endpoint: 'getGamesMine',
    useContext,
  });
