import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Given } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { AuthV1Parameter } from '../../auth/models/AuthV1Parameter';
import { whenCreateCodeAuthRequestIsSendFromUserActivationMail } from '../../auth/step-definitions/whenDefinitions';
import { setAuth } from '../../auth/utils/actions/setAuth';
import { getAuthOrFail } from '../../auth/utils/calculations/getAuthOrFail';
import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { setRequestParameters } from '../../http/utils/actions/setRequestParameters';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';
import { UserV1Parameter } from '../models/UserV1Parameter';
import { setUser } from '../utils/actions/setUser';
import {
  whenCreateUserRequestIsSend,
  whenGetUserMeRequestIsSend,
  whenUpdateUserMeRequestIsSend,
} from './whenDefinitions';

export function givenCreateUserRequest(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const processedRequestAlias: string = requestAlias ?? defaultAlias;

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

  setRequestParameters.bind(this)('createUser', processedRequestAlias, [
    {},
    userCreateQueryV1,
  ]);
}

export async function givenUser(
  this: OneGameApiWorld,
  requestAlias?: string,
  userAlias?: string,
): Promise<void> {
  const processedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  givenCreateUserRequest.bind(this)(processedRequestAlias);
  await whenCreateUserRequestIsSend.bind(this)(processedRequestAlias);

  const [, userCreateQueryV1]: Parameters<HttpClient['createUser']> =
    getRequestParametersOrFail(this, 'createUser', processedRequestAlias);

  type CreateUserResponseType = Awaited<ReturnType<HttpClient['createUser']>>;

  const createUserResponse: CreateUserResponseType =
    getResponseParametersOrFail(this, 'createUser', processedRequestAlias);

  if (createUserResponse.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected user to be created, an unexpected ${createUserResponse.statusCode} status code was received instead`,
    );
  }

  await whenCreateCodeAuthRequestIsSendFromUserActivationMail.bind(this)(
    requestAlias,
  );

  type CreateAuthResponseType = Awaited<ReturnType<HttpClient['createAuth']>>;

  const createCodeAuthResponse: CreateAuthResponseType =
    getResponseParametersOrFail(this, 'createAuth', processedRequestAlias);

  if (createCodeAuthResponse.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected auth to be created, an unexpected ${createUserResponse.statusCode} status code was received instead`,
    );
  }

  setAuth.bind(this)(processedUserAlias, {
    auth: createCodeAuthResponse.body,
    authCreateQuery: getRequestParametersOrFail(
      this,
      'createAuth',
      processedRequestAlias,
    )[1],
  });

  givenUpdateUserRequestFromUser.bind(this)(
    processedRequestAlias,
    processedUserAlias,
    {
      active: true,
    },
  );

  await whenUpdateUserMeRequestIsSend.bind(this)(processedRequestAlias);

  givenGetUserMeRequestFromUserCredentials.bind(this)(
    processedRequestAlias,
    processedUserAlias,
  );

  await whenGetUserMeRequestIsSend.bind(this)(processedRequestAlias);

  type GetUserMeResponseType = Awaited<ReturnType<HttpClient['getUserMe']>>;

  const getUserMeResponse: GetUserMeResponseType = getResponseParametersOrFail(
    this,
    'getUserMe',
    processedRequestAlias,
  );

  if (getUserMeResponse.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected user to be retrieved, an unexpected ${getUserMeResponse.statusCode} status code was received instead`,
    );
  }

  const userParameter: UserV1Parameter = {
    user: getUserMeResponse.body,
    userCreateQuery: userCreateQueryV1,
  };

  setUser.bind(this)(processedUserAlias, userParameter);
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

export function givenGetUserMeRequestFromUserCredentials(
  this: OneGameApiWorld,
  requestAlias?: string | undefined,
  userAlias?: string | undefined,
): void {
  const procesedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const authV1Parameter: AuthV1Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const getUserMeRequestParameters: Parameters<HttpClient['getUserMe']> = [
    {
      authorization: `Bearer ${authV1Parameter.auth.jwt}`,
    },
  ];

  setRequestParameters.bind(this)(
    'getUserMe',
    procesedRequestAlias,
    getUserMeRequestParameters,
  );
}

export function givenUpdateUserRequestFromUser(
  this: OneGameApiWorld,
  requestAlias?: string | undefined,
  userAlias?: string | undefined,
  userMeUpdateQueryV1?: apiModels.UserMeUpdateQueryV1 | undefined,
): void {
  const procesedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const authV1Parameter: AuthV1Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const processedUserMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1 =
    userMeUpdateQueryV1 ?? {
      name: faker.person.fullName(),
    };

  const updateUserMeRequestParameters: Parameters<HttpClient['updateUserMe']> =
    [
      {
        authorization: `Bearer ${authV1Parameter.auth.jwt}`,
      },
      processedUserMeUpdateQueryV1,
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
  async function (this: OneGameApiWorld, userAlias: string): Promise<void> {
    await givenUser.bind(this)(userAlias, userAlias);
  },
);

Given<OneGameApiWorld>(
  'an update own user request from {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenUpdateUserRequestFromUser.bind(this)(userAlias, userAlias);
  },
);
