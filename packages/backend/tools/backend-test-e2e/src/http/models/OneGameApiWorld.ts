import { HttpClient } from '@cornie-js/api-http-client';
import { IWorld } from '@cucumber/cucumber';

import { UserParameterV1 } from '../../user/models/UserV1Parameter';

export interface EntitiesMap {
  users: Map<string, UserParameterV1>;
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
