import { useSingleApiCall } from '../../../common/hooks/useSingleApiCall';
import { buildErrorMessage } from './utils/buildErrorMessage';
import { buildRequestParams } from './utils/buildRequestParams';
import { buildResult } from './utils/buildResult';
import { useContext } from './utils/useContext';

export const useGetGames = () =>
  useSingleApiCall({
    buildErrorMessage,
    buildRequestParams,
    buildResult,
    endpoint: 'getGamesMine',
    useContext,
  });
