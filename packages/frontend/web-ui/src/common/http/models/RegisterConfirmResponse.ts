import { HttpClient } from '@cornie-js/api-http-client';

export type RegisterConfirmResponse = Awaited<
  ReturnType<HttpClient['updateUserMe']>
>;
