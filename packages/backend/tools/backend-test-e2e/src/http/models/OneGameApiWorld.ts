import { HttpClient, HttpClientEndpoints } from '@cornie-js/api-http-client';
import { IWorld } from '@cucumber/cucumber';

import { AuthV2Parameter } from '../../auth/models/AuthV2Parameter';
import { CardArrayV1Parameter } from '../../card/models/CardArrayV1Parameter';
import { GameEventSubscriptionV2Parameter } from '../../game/models/GameEventSubscriptionV2Parameter';
import { GameOptionsV1Parameter } from '../../game/models/GameOptionsV1Parameter';
import { GameV1Parameter } from '../../game/models/GameV1Parameter';
import { UserV1Parameter } from '../../user/models/UserV1Parameter';

export interface EntitiesMap {
  auth: Map<string, AuthV2Parameter>;
  cardArrays: Map<string, CardArrayV1Parameter>;
  gameEventSubscriptions: Map<string, GameEventSubscriptionV2Parameter>;
  gameOptions: Map<string, GameOptionsV1Parameter>;
  games: Map<string, GameV1Parameter>;
  users: Map<string, UserV1Parameter>;
}

export interface Environment {
  backendBaseUrl: string;
}

export type RequestMap = {
  [TKey in keyof HttpClientEndpoints]?: Record<
    string,
    Parameters<HttpClientEndpoints[TKey]>
  >;
};

export type ResponseMap = {
  [TKey in keyof HttpClientEndpoints]?: Record<
    string,
    Awaited<ReturnType<HttpClientEndpoints[TKey]>>
  >;
};

export interface OneGameApiWorld extends IWorld {
  entities: EntitiesMap;
  env: Environment;
  httpClient: HttpClient;
  requestParameters: RequestMap;
  responses: ResponseMap;
}
