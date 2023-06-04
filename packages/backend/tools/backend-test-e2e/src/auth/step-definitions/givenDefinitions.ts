import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Given } from '@cucumber/cucumber';
import { HttpStatus } from '@nestjs/common';

import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { setRequestParameters } from '../../http/utils/actions/setRequestParameters';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { getResponseParametersOrFail } from '../../http/utils/calculations/getResponseOrFail';
import { UserV1Parameter } from '../../user/models/UserV1Parameter';
import { getUserOrFail } from '../../user/utils/calculations/getUserOrFail';
import { AuthV1Parameter } from '../models/AuthV1Parameter';
import { setAuth } from '../utils/actions/setAuth';
import { whenCreateAuthRequestIsSend } from './whenDefinitions';

export async function givenAuthForUser(
  this: OneGameApiWorld,
  userAlias?: string,
): Promise<void> {
  const alias: string = userAlias ?? defaultAlias;

  givenCreateAuthRequestForUser.bind(this)(alias, alias);
  whenCreateAuthRequestIsSend.bind(this)(alias);

  type ResponseType = Awaited<ReturnType<HttpClient['createAuth']>>;

  const [, authCreateQueryV1]: Parameters<HttpClient['createAuth']> =
    getRequestParametersOrFail(this, 'createAuth', alias);

  const response: ResponseType = await getResponseParametersOrFail(
    this,
    'createAuth',
    alias,
  );

  if (response.statusCode !== HttpStatus.OK) {
    throw new Error(
      `Expected user auth to be created, an unexpected ${response.statusCode} status code was received instead`,
    );
  }

  const authParameter: AuthV1Parameter = {
    auth: response.body,
    authCreateQuery: authCreateQueryV1,
  };

  setAuth.bind(this)(alias, authParameter);
}

export function givenCreateAuthRequestForUser(
  this: OneGameApiWorld,
  userAlias?: string,
  requestAlias?: string,
): void {
  const procesedUserAlias: string = userAlias ?? defaultAlias;
  const procesedRequestAlias: string = requestAlias ?? defaultAlias;

  const userParameter: UserV1Parameter =
    getUserOrFail.bind(this)(procesedUserAlias);

  const authCreateQuery: apiModels.AuthCreateQueryV1 = {
    email: userParameter.userCreateQuery.email,
    password: userParameter.userCreateQuery.password,
  };

  const requestParameters: Parameters<HttpClient['createAuth']> = [
    {},
    authCreateQuery,
  ];

  setRequestParameters(
    this,
    'createAuth',
    procesedRequestAlias,
    requestParameters,
  );
}

Given<OneGameApiWorld>(
  'a create auth request for {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenCreateAuthRequestForUser.bind(this)(userAlias);
  },
);

Given<OneGameApiWorld>(
  'a user auth for {string}',
  async function (this: OneGameApiWorld, userAlias: string): Promise<void> {
    await givenAuthForUser.bind(this)(userAlias);
  },
);
