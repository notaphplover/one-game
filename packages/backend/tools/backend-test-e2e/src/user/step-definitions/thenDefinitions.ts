import { HttpClientEndpoints } from '@cornie-js/api-http-client';
import { Then } from '@cucumber/cucumber';
import { HttpStatus } from '@nestjs/common';

import { expectObjectContaining } from '../../foundation/adapter/node/assertions/expectObjectContaining';
import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';

function thenCreateUserResponseShouldContainValidUser(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  const [, userCreateQueryV1]: Parameters<HttpClientEndpoints['createUser']> =
    getRequestParametersOrFail(this, 'createUser', alias);

  type ResponseType = Awaited<ReturnType<HttpClientEndpoints['createUser']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'createUser',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    body: {
      active: false,
      id: () => undefined,
      name: userCreateQueryV1.name,
    },
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

function thenCreateUserCodeResponseShouldBeSuccessful(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  type ResponseType = Awaited<
    ReturnType<HttpClientEndpoints['createUserByEmailCode']>
  >;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'createUserByEmailCode',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    headers: {},
    statusCode: HttpStatus.CREATED,
  });
}

function thenCreateUserCodeResponseShouldFailDueToConflict(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  type ResponseType = Awaited<
    ReturnType<HttpClientEndpoints['createUserByEmailCode']>
  >;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'createUserByEmailCode',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    headers: {},
    statusCode: HttpStatus.CONFLICT,
  });
}

function thenDeleteUserCodeResponseShouldBeSuccessful(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  type ResponseType = Awaited<
    ReturnType<HttpClientEndpoints['deleteUserByEmailCode']>
  >;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'deleteUserByEmailCode',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

function thenDeleteUserMeResponseShouldBeSuccessful(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  type ResponseType = Awaited<ReturnType<HttpClientEndpoints['deleteUserMe']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'deleteUserMe',
    alias,
  );

  expectObjectContaining<ResponseType>(response, {
    headers: {},
    statusCode: HttpStatus.OK,
  });
}

function thenUpdateUserResponseShouldContainValidUser(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  const [, userMeUpdateQueryV1]: Parameters<
    HttpClientEndpoints['updateUserMe']
  > = getRequestParametersOrFail(this, 'updateUserMe', alias);

  type ResponseType = Awaited<ReturnType<HttpClientEndpoints['updateUserMe']>>;

  const response: ResponseType = getResponseParametersOrFail(
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
  function (): void {
    thenCreateUserResponseShouldContainValidUser.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the create user code response should be successful',
  function (): void {
    thenCreateUserCodeResponseShouldBeSuccessful.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the create user code response as {string} should be successful',
  function (requestAlias: string): void {
    thenCreateUserCodeResponseShouldBeSuccessful.bind(this)(requestAlias);
  },
);

Then<OneGameApiWorld>(
  'the create user code response as {string} should fail due to a conflict',
  function (requestAlias: string): void {
    thenCreateUserCodeResponseShouldFailDueToConflict.bind(this)(requestAlias);
  },
);

Then<OneGameApiWorld>(
  'the create user response as {string} should contain a valid user',
  function (requestAlias: string): void {
    thenCreateUserResponseShouldContainValidUser.bind(this)(requestAlias);
  },
);

Then<OneGameApiWorld>(
  'the delete own user response for {string} should be successful',
  function (requestAlias: string): void {
    thenDeleteUserMeResponseShouldBeSuccessful.bind(this)(requestAlias);
  },
);

Then<OneGameApiWorld>(
  'the delete user code response should be successful',
  function (): void {
    thenDeleteUserCodeResponseShouldBeSuccessful.bind(this)();
  },
);

Then<OneGameApiWorld>(
  'the update own user response for {string} should return an updated user',
  function (this: OneGameApiWorld, userAlias: string): void {
    thenUpdateUserResponseShouldContainValidUser.bind(this)(userAlias);
  },
);
