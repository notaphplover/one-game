import { HttpClientEndpoints } from '@cornie-js/api-http-client';
import { Then } from '@cucumber/cucumber';
import { HttpStatus } from '@nestjs/common';

import { expectObjectContaining } from '../../foundation/adapter/node/assertions/expectObjectContaining';
import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';

function thenCreateAuthResponseShouldContainValidUserAuth(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  type ResponseType = Awaited<ReturnType<HttpClientEndpoints['createAuthV2']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'createAuthV2',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: {
      accessToken: () => undefined,
      refreshToken: () => undefined,
    },
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

Then<OneGameApiWorld>(
  'the create auth response should contain a valid user auth',
  function (): void {
    thenCreateAuthResponseShouldContainValidUserAuth.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the create auth response as {string} should contain a valid user auth',
  function (requestAlias: string): void {
    thenCreateAuthResponseShouldContainValidUserAuth.bind(this)(requestAlias);
  },
);
