import { HttpClient } from '@cornie-js/api-http-client';

export type AuthResponse = Awaited<ReturnType<HttpClient['createAuth']>>;
