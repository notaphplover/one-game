import { HttpClient } from '@cornie-js/api-http-client';

import { OneGameApiWorld } from '../../models/OneGameApiWorld';

export function initializeWorld(
  this: Partial<OneGameApiWorld>,
  baseUrl: string,
): void {
  this.entities = {
    auth: new Map(),
    cardArrays: new Map(),
    gameEventSubscriptions: new Map(),
    gameOptions: new Map(),
    games: new Map(),
    users: new Map(),
  };
  this.env = {
    backendBaseUrl: baseUrl,
  };
  this.httpClient = new HttpClient(baseUrl);
  this.requestParameters = {};
  this.responses = {};
}
