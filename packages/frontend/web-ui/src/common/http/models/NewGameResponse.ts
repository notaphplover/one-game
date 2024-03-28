import { HttpClient } from '@cornie-js/api-http-client';

export type NewGameResponse = Awaited<ReturnType<HttpClient['createGame']>>;
