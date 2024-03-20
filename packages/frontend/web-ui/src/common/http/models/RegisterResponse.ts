import { HttpClient } from '@cornie-js/api-http-client';

export type RegisterResponse = Awaited<ReturnType<HttpClient['createUser']>>;
