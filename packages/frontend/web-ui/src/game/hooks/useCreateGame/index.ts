import { buildSingleApiCallHook } from '../../../common/helpers/buildSingleApiCallHook';
import { buildContext } from './utils/buildContext';
import { buildRequestParams } from './utils/buildRequestParams';
import { buildErrorMessage } from './utils/buildErrorMessage';
import { buildResult } from './utils/buildResult';

export const useCreateGame = () =>
  buildSingleApiCallHook({
    buildContext,
    buildErrorMessage,
    buildRequestParams,
    buildResult,
    endpoint: 'createGame',
  });