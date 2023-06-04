import { HttpClient } from '@cornie-js/api-http-client';
import { IWorld } from '@cucumber/cucumber';

import { AuthV1Parameter } from '../../auth/models/AuthV1Parameter';
import { UserV1Parameter } from '../../user/models/UserV1Parameter';

export interface EntitiesMap {
  auth: Map<string, AuthV1Parameter>;
  users: Map<string, UserV1Parameter>;
}

export type RequestMap = {
  [TKey in keyof HttpClient]?: Record<string, Parameters<HttpClient[TKey]>>;
};

export type ResponseMap = {
  [TKey in keyof HttpClient]?: Record<string, ReturnType<HttpClient[TKey]>>;
};

export interface OneGameApiWorld extends IWorld {
  entities: EntitiesMap;
  httpClient: HttpClient;
  requestParameters: RequestMap;
  pendingResponses: ResponseMap;
}
