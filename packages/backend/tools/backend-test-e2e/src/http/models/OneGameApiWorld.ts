import { HttpClient } from '@cornie-js/api-http-client';
import { IWorld } from '@cucumber/cucumber';

import { AuthV2Parameter } from '../../auth/models/AuthV2Parameter';
import { CardArrayV1Parameter } from '../../card/models/CardArrayV1Parameter';
import { GameOptionsV1Parameter } from '../../game/models/GameOptionsV1Parameter';
import { GameV1Parameter } from '../../game/models/GameV1Parameter';
import { UserV1Parameter } from '../../user/models/UserV1Parameter';

export interface EntitiesMap {
  auth: Map<string, AuthV2Parameter>;
  cardArrays: Map<string, CardArrayV1Parameter>;
  gameOptions: Map<string, GameOptionsV1Parameter>;
  games: Map<string, GameV1Parameter>;
  users: Map<string, UserV1Parameter>;
}

export type RequestMap = {
  [TKey in keyof HttpClient]?: Record<string, Parameters<HttpClient[TKey]>>;
};

export type ResponseMap = {
  [TKey in keyof HttpClient]?: Record<
    string,
    Awaited<ReturnType<HttpClient[TKey]>>
  >;
};

export interface OneGameApiWorld extends IWorld {
  entities: EntitiesMap;
  httpClient: HttpClient;
  requestParameters: RequestMap;
  responses: ResponseMap;
}
