import { HttpClientEndpoints } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Given } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { AuthV2Parameter } from '../../auth/models/AuthV2Parameter';
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
import { getUserOrFail } from '../utils/calculations/getUserOrFail';
import {
  whenCreateUserCodeRequestIsSend,
  whenCreateUserRequestIsSend,
  whenDeleteUserCodeRequestIsSend,
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

export function givenCreateCodeRequestForUser(
  this: OneGameApiWorld,
  userCodekKind: apiModels.UserCodeKindV1,
  userAlias?: string,
  requestAlias?: string,
): void {
  const procesedUserAlias: string = userAlias ?? defaultAlias;
  const procesedRequestAlias: string = requestAlias ?? defaultAlias;

  const userParameter: UserV1Parameter =
    getUserOrFail.bind(this)(procesedUserAlias);

  const requestParameters: Parameters<
    HttpClientEndpoints['createUserByEmailCode']
  > = [
    {},
    {
      email: userParameter.userCreateQuery.email,
    },
    {
      kind: userCodekKind,
    },
  ];

  setRequestParameters.bind(this)(
    'createUserByEmailCode',
    procesedRequestAlias,
    requestParameters,
  );
}

export function givenDeleteCodeRequestForUser(
  this: OneGameApiWorld,
  userAlias?: string,
  requestAlias?: string,
): void {
  const procesedUserAlias: string = userAlias ?? defaultAlias;
  const procesedRequestAlias: string = requestAlias ?? defaultAlias;

  const userParameter: UserV1Parameter =
    getUserOrFail.bind(this)(procesedUserAlias);

  const requestParameters: Parameters<
    HttpClientEndpoints['deleteUserByEmailCode']
  > = [
    {},
    {
      email: userParameter.userCreateQuery.email,
    },
  ];

  setRequestParameters.bind(this)(
    'deleteUserByEmailCode',
    procesedRequestAlias,
    requestParameters,
  );
}

async function givenNonActiveUser(
  this: OneGameApiWorld,
  requestAlias?: string,
  userAlias?: string,
): Promise<void> {
  const processedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  givenCreateUserRequest.bind(this)(processedRequestAlias);
  await whenCreateUserRequestIsSend.bind(this)(processedRequestAlias);

  const [, userCreateQueryV1]: Parameters<HttpClientEndpoints['createUser']> =
    getRequestParametersOrFail(this, 'createUser', processedRequestAlias);

  type CreateUserResponseType = Awaited<
    ReturnType<HttpClientEndpoints['createUser']>
  >;

  const createUserResponse: CreateUserResponseType =
    getResponseParametersOrFail(this, 'createUser', processedRequestAlias);

  if (createUserResponse.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected user to be created, an unexpected ${createUserResponse.statusCode.toString()} status code was received instead`,
    );
  }

  const userParameter: UserV1Parameter = {
    user: createUserResponse.body,
    userCreateQuery: userCreateQueryV1,
  };

  setUser.bind(this)(processedUserAlias, userParameter);
}

export async function givenUser(
  this: OneGameApiWorld,
  requestAlias?: string,
  userAlias?: string,
): Promise<void> {
  const processedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  await givenNonActiveUser.bind(this)(requestAlias, userAlias);

  givenCreateCodeRequestForUser.bind(this)(
    'registerConfirm',
    userAlias,
    requestAlias,
  );

  await whenCreateUserCodeRequestIsSend.bind(this)(requestAlias);

  await whenCreateCodeAuthRequestIsSendFromUserActivationMail.bind(this)(
    requestAlias,
  );

  type CreateAuthResponseType = Awaited<
    ReturnType<HttpClientEndpoints['createAuthV2']>
  >;

  const createCodeAuthResponse: CreateAuthResponseType =
    getResponseParametersOrFail(this, 'createAuthV2', processedRequestAlias);

  if (createCodeAuthResponse.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected auth to be created, an unexpected ${createCodeAuthResponse.statusCode.toString()} status code was received instead`,
    );
  }

  const [, authCreateQueryV2]: Parameters<HttpClientEndpoints['createAuthV2']> =
    getRequestParametersOrFail(this, 'createAuthV2', processedRequestAlias);

  if (authCreateQueryV2 === undefined) {
    throw new Error('Expected auth create query V2 to be defined');
  }

  setAuth.bind(this)(processedUserAlias, {
    auth: createCodeAuthResponse.body,
    authCreateQuery: authCreateQueryV2,
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

  type GetUserMeResponseType = Awaited<
    ReturnType<HttpClientEndpoints['getUserMe']>
  >;

  const getUserMeResponse: GetUserMeResponseType = getResponseParametersOrFail(
    this,
    'getUserMe',
    processedRequestAlias,
  );

  if (getUserMeResponse.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected user to be retrieved, an unexpected ${getUserMeResponse.statusCode.toString()} status code was received instead`,
    );
  }

  const previousUserParameter: UserV1Parameter =
    getUserOrFail.bind(this)(processedUserAlias);

  const userParameter: UserV1Parameter = {
    user: getUserMeResponse.body,
    userCreateQuery: previousUserParameter.userCreateQuery,
  };

  setUser.bind(this)(processedUserAlias, userParameter);

  givenDeleteCodeRequestForUser.bind(this)(userAlias, requestAlias);

  await whenDeleteUserCodeRequestIsSend.bind(this)(requestAlias);
}

export function givenDeleteOwnUserRequestFromUser(
  this: OneGameApiWorld,
  requestAlias?: string,
  userAlias?: string,
): void {
  const procesedRequestAlias: string = requestAlias ?? defaultAlias;
  const processedUserAlias: string = userAlias ?? defaultAlias;

  const authV2Parameter: AuthV2Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const deleteUserMeRequestParameters: Parameters<
    HttpClientEndpoints['deleteUserMe']
  > = [
    {
      authorization: `Bearer ${authV2Parameter.auth.accessToken}`,
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

  const authV2Parameter: AuthV2Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const getUserMeRequestParameters: Parameters<
    HttpClientEndpoints['getUserMe']
  > = [
    {
      authorization: `Bearer ${authV2Parameter.auth.accessToken}`,
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

  const authV2Parameter: AuthV2Parameter =
    getAuthOrFail.bind(this)(processedUserAlias);

  const processedUserMeUpdateQueryV1: apiModels.UserMeUpdateQueryV1 =
    userMeUpdateQueryV1 ?? {
      name: faker.person.fullName(),
    };

  const updateUserMeRequestParameters: Parameters<
    HttpClientEndpoints['updateUserMe']
  > = [
    {
      authorization: `Bearer ${authV2Parameter.auth.accessToken}`,
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
  'a {userCodeKind} create user code request for {string}',
  function (
    this: OneGameApiWorld,
    userCodeKind: apiModels.UserCodeKindV1,
    userAlias: string,
  ): void {
    givenCreateCodeRequestForUser.bind(this)(userCodeKind, userAlias);
  },
);

Given<OneGameApiWorld>(
  'a {userCodeKind} create user code request for {string} as {string}',
  function (
    this: OneGameApiWorld,
    userCodeKind: apiModels.UserCodeKindV1,
    userAlias: string,
    requestAlias: string,
  ): void {
    givenCreateCodeRequestForUser.bind(this)(
      userCodeKind,
      userAlias,
      requestAlias,
    );
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
  'a delete user code request for {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenDeleteCodeRequestForUser.bind(this)(userAlias);
  },
);

Given<OneGameApiWorld>(
  'a non active user',
  async function (this: OneGameApiWorld): Promise<void> {
    await givenNonActiveUser.bind(this)();
  },
);

Given<OneGameApiWorld>(
  'a non active user {string}',
  async function (this: OneGameApiWorld, userAlias: string): Promise<void> {
    await givenNonActiveUser.bind(this)(userAlias, userAlias);
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
