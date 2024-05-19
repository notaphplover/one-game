import { useSingleAuthorizedApiCall } from '../../../common/hooks/useSingleAuthorizedApiCall';
import { buildErrorMessage } from './utils/buildErrorMessage';
import { buildRequestParams } from './utils/buildRequestParams';
import { buildResult } from './utils/buildResult';
import { useContext } from './utils/useContext';

export const useCreateGame = () =>
  useSingleAuthorizedApiCall({
    buildErrorMessage,
    buildRequestParams,
    buildResult,
    endpoint: 'createGame',
    useContext,
  });
