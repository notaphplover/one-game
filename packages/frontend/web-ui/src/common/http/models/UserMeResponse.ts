import { HttpClient } from '@cornie-js/api-http-client';

export type UserMeResponse = Awaited<ReturnType<HttpClient['getUserMe']>>;
