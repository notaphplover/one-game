import { models as apiModels } from '@cornie-js/api-models';
import { Mutex } from 'async-mutex';

import { SerializableAppError } from '../../foundation/error/SerializableAppError';
import { QueryReturnValue } from '../../foundation/http/models/QueryReturnValue';
import { CreateAuthV2Args } from './CreateAuthV2Args';

export interface AuthorizedEndpointsOptions<TState> {
  createAuthV2: (
    args: CreateAuthV2Args,
  ) => Promise<QueryReturnValue<apiModels.AuthV2, SerializableAppError, never>>;
  mutex: Mutex;
  login: (auth: apiModels.AuthV2) => {
    payload: apiModels.AuthV2;
    type: string;
  };
  logout: () => {
    payload: undefined;
    type: string;
  };
  selectAccessToken: (state: TState) => string | null;
  selectRefreshToken: (state: TState) => string | null;
}
