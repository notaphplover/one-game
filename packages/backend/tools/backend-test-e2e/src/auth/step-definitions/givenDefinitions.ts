import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { Given } from '@cucumber/cucumber';

import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { setRequestParameters } from '../../http/utils/actions/setRequestParameters';
import { UserParameterV1 } from '../../user/models/UserV1Parameter';
import { getUserOrFail } from '../../user/utilsl/actions/getUserOrFail';

export function givenCreateAuthRequestFromUser(
  this: OneGameApiWorld,
  userAlias?: string,
  requestAlias?: string,
): void {
  const proccesedUserAlias: string = userAlias ?? defaultAlias;
  const proccesedRequestAlias: string = requestAlias ?? defaultAlias;

  const userParameter: UserParameterV1 =
    getUserOrFail.bind(this)(proccesedUserAlias);

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
    proccesedRequestAlias,
    requestParameters,
  );
}

Given<OneGameApiWorld>(
  'a create auth request for {string}',
  function (this: OneGameApiWorld, userAlias: string): void {
    givenCreateAuthRequestFromUser.bind(this)(userAlias);
  },
);
