import { useSingleApiCall } from '../../../common/helpers/useSingleApiCall';
import { buildErrorMessage } from './utils/buildErrorMessage';
import { buildRequestParams } from './utils/buildRequestParams';
import { buildResult } from './utils/buildResult';
import { useContext } from './utils/useContext';

export const useCreateGame = () =>
  useSingleApiCall({
    buildErrorMessage,
    buildRequestParams,
    buildResult,
    endpoint: 'createGame',
    useContext,
  });
