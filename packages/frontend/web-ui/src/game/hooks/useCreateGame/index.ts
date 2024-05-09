import { buildSingleApiCallHook } from '../../../common/helpers/buildSingleApiCallHook';
import { buildContext } from './utils/buildContext';
import { buildErrorMessage } from './utils/buildErrorMessage';
import { buildRequestParams } from './utils/buildRequestParams';
import { buildResult } from './utils/buildResult';

export const useCreateGame = () =>
  buildSingleApiCallHook({
    buildContext,
    buildErrorMessage,
    buildRequestParams,
    buildResult,
    endpoint: 'createGame',
  });
