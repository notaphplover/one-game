import { HttpClient } from '@cornie-js/api-http-client';

import { OneGameApiWorld } from '../../models/OneGameApiWorld';

export function initializeWorld(
  this: Partial<OneGameApiWorld>,
  baseUrl: string,
): void {
  this.entities = {
    auth: new Map(),
    games: new Map(),
    users: new Map(),
  };
  this.httpClient = new HttpClient(baseUrl);
  this.requestParameters = {};
  this.responses = {};
}
