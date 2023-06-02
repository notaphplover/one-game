import { HttpClient } from '@cornie-js/api-http-client';
import { IWorld } from '@cucumber/cucumber';

export type RequestMap = {
  [TKey in keyof HttpClient]?: Record<string, Parameters<HttpClient[TKey]>>;
};

export type ResponseMap = {
  [TKey in keyof HttpClient]?: Record<string, ReturnType<HttpClient[TKey]>>;
};

export interface OneGameApiWorld extends IWorld {
  httpClient: HttpClient;
  requestParameters: RequestMap;
  pendingResponses: ResponseMap;
}
