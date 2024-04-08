import { HttpClient } from '@cornie-js/api-http-client';

export type JoinGameResponse = Awaited<
  ReturnType<HttpClient['createGameSlot']>
>;
