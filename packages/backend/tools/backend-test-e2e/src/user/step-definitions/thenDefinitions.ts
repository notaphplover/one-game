import { HttpClient } from '@cornie-js/api-http-client';
import { Then } from '@cucumber/cucumber';
import { HttpStatus } from '@nestjs/common';

import { expectObjectContaining } from '../../foundation/adapter/node/assertions/expectObjectContaining';
import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';

async function thenCreateUserResponseShouldContainValidUser(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  const alias: string = requestAlias ?? defaultAlias;

  const [, userCreateQueryV1]: Parameters<HttpClient['createUser']> =
    getRequestParametersOrFail(this, 'createUser', alias);

  type ResponseType = Awaited<ReturnType<HttpClient['createUser']>>;

  const response: ResponseType = await getResponseParametersOrFail(
    this,
    'createUser',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: {
      id: () => undefined,
      name: userCreateQueryV1.name,
    },
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

async function thenUpdateUserResponseShouldContainValidUser(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  const alias: string = requestAlias ?? defaultAlias;

  const [, userMeUpdateQueryV1]: Parameters<HttpClient['updateUserMe']> =
    getRequestParametersOrFail(this, 'updateUserMe', alias);

  type ResponseType = Awaited<ReturnType<HttpClient['updateUserMe']>>;

  const response: ResponseType = await getResponseParametersOrFail(
    this,
    'updateUserMe',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: {
      id: () => undefined,
      name: userMeUpdateQueryV1.name as string,
    },
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

Then<OneGameApiWorld>(
  'the create user response should contain a valid user',
  async function (): Promise<void> {
    await thenCreateUserResponseShouldContainValidUser.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the create user response as {string} should contain a valid user',
  async function (requestAlias: string): Promise<void> {
    await thenCreateUserResponseShouldContainValidUser.bind(this)(requestAlias);
  },
);

Then<OneGameApiWorld>(
  'the update own user response for {string} should return an updated user',
  async function (this: OneGameApiWorld, userAlias: string): Promise<void> {
    await thenUpdateUserResponseShouldContainValidUser.bind(this)(userAlias);
  },
);
