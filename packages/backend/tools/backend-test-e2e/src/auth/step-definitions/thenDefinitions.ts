import { HttpClient } from '@cornie-js/api-http-client';
import { Then } from '@cucumber/cucumber';
import { HttpStatus } from '@nestjs/common';

import { expectObjectContaining } from '../../foundation/adapter/node/assertions/expectObjectContaining';
import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';

async function thenCreateAuthResponseShouldContainValidUserAuth(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  const alias: string = requestAlias ?? defaultAlias;

  type ResponseType = Awaited<ReturnType<HttpClient['createAuth']>>;

  const response: ResponseType = await getResponseParametersOrFail(
    this,
    'createAuth',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: {
      jwt: () => undefined,
    },
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

Then<OneGameApiWorld>(
  'the create auth response should contain a valid user auth',
  async function (): Promise<void> {
    await thenCreateAuthResponseShouldContainValidUserAuth.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the create auth response as {string} should contain a valid user auth',
  async function (requestAlias: string): Promise<void> {
    await thenCreateAuthResponseShouldContainValidUserAuth.bind(this)(
      requestAlias,
    );
  },
);
