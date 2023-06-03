import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Given } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { setRequestParameters } from '../../http/utils/actions/setRequestParameters';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';
import { UserParameterV1 } from '../models/UserV1Parameter';
import { setUser } from '../utilsl/actions/setUser';
import { whenCreateUserRequestIsSend } from './whenDefinitions';

export function givenCreateUserRequest(
  this: OneGameApiWorld,
  requestAlias?: string,
): void {
  const alias: string = requestAlias ?? defaultAlias;

  const userCreateQueryV1: apiModels.UserCreateQueryV1 = {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password({ length: 20 }),
  };

  setRequestParameters(this, 'createUser', alias, [{}, userCreateQueryV1]);
}

export async function givenUser(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  const alias: string = requestAlias ?? defaultAlias;

  givenCreateUserRequest.bind(this)(alias);
  whenCreateUserRequestIsSend.bind(this)(alias);

  const [, userCreateQueryV1]: Parameters<HttpClient['createUser']> =
    getRequestParametersOrFail(this, 'createUser', alias);

  type ResponseType = Awaited<ReturnType<HttpClient['createUser']>>;

  const response: ResponseType = await getResponseParametersOrFail(
    this,
    'createUser',
    alias,
  );

  if (response.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected user to be created, an unexpected ${response.statusCode} status code was received instead`,
    );
  }

  const userParameter: UserParameterV1 = {
    user: response.body,
    userCreateQuery: userCreateQueryV1,
  };

  setUser.bind(this)(alias, userParameter);
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
