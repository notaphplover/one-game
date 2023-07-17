import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Given } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { AuthV1Parameter } from '../../auth/models/AuthV1Parameter';
import { getAuthOrFail } from '../../auth/utils/calculations/getAuthOrFail';
import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { setRequestParameters } from '../../http/utils/actions/setRequestParameters';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';
import { UserV1Parameter } from '../models/UserV1Parameter';
import { setUser } from '../utils/actions/setUser';
import { whenCreateUserRequestIsSend } from './whenDefinitions';

export function givenCreateUserRequest(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  const firstName: string = faker.person.firstName();
  const lastName: string = faker.person.lastName();

  const email: string = faker.internet.email({
    firstName,
    lastName,
  });

  const fullName: string = faker.person.fullName({
    firstName,
    lastName,
  });

  const userCreateQueryV1: apiModels.UserCreateQueryV1 = {
    email,
    name: fullName,
    password: faker.internet.password({ length: 20 }),
  };

  setRequestParameters.bind(this)('createUser', alias, [{}, userCreateQueryV1]);
}

export async function givenUser(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  const alias: string = requestAlias ?? defaultAlias;

  givenCreateUserRequest.bind(this)(alias);
  await whenCreateUserRequestIsSend.bind(this)(alias);

  const [, userCreateQueryV1]: Parameters<HttpClient['createUser']> =
    getRequestParametersOrFail(this, 'createUser', alias);

  type ResponseType = Awaited<ReturnType<HttpClient['createUser']>>;

  const response: ResponseType = getResponseParametersOrFail(
    this,
    'createUser',
    alias,
  );

  if (response.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected user to be created, an unexpected ${response.statusCode} status code was received instead`,
    );
  }

  const userParameter: UserV1Parameter = {
    user: response.body,
    userCreateQuery: userCreateQueryV1,
  };

  setUser.bind(this)(alias, userParameter);
}

export function givenDeleteOwnUserRequestFromUser(
  this: OneGameApiWorld,
  requestAlias?: string,
  userAlias?: string,
): void {
  const procesedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const authV1Parameter: AuthV1Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const deleteUserMeRequestParameters: Parameters<HttpClient['deleteUserMe']> =
    [
      {
        authorization: `Bearer ${authV1Parameter.auth.jwt}`,
      },
    ];

  setRequestParameters.bind(this)(
    'deleteUserMe',
    procesedRequestAlias,
    deleteUserMeRequestParameters,
  );
}

export function givenUpdateUserRequestFromUser(
  this: OneGameApiWorld,
  requestAlias?: string,
  userAlias?: string,
): void {
  const procesedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const authV1Parameter: AuthV1Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const userMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1 = {
    name: faker.person.fullName(),
  };

  const updateUserMeRequestParameters: Parameters<HttpClient['updateUserMe']> =
    [
      {
        authorization: `Bearer ${authV1Parameter.auth.jwt}`,
      },
      userMeUpdateQueryV1,
    ];

  setRequestParameters.bind(this)(
    'updateUserMe',
    procesedRequestAlias,
    updateUserMeRequestParameters,
  );
}

Given<OneGameApiWorld>(
  'a create user request',
  function (this: OneGameApiWorld): void {
    givenCreateUserRequest.bind(this)();
  },
);

Given<OneGameApiWorld>(
  'a create user request as {string}',
  function (this: OneGameApiWorld, requestAlias: string): void {
    givenCreateUserRequest.bind(this)(requestAlias);
  },
);

Given<OneGameApiWorld>(
  'a delete own user request from {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenDeleteOwnUserRequestFromUser.bind(this)(userAlias, userAlias);
  },
);

Given<OneGameApiWorld>(
  'a user',
  async function (this: OneGameApiWorld): Promise<void> {
    await givenUser.bind(this)();
  },
);

Given<OneGameApiWorld>(
  'a user {string}',
  async function (this: OneGameApiWorld, requestAlias: string): Promise<void> {
    await givenUser.bind(this)(requestAlias);
  },
);

Given<OneGameApiWorld>(
  'an update own user request from {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenUpdateUserRequestFromUser.bind(this)(userAlias, userAlias);
  },
);
