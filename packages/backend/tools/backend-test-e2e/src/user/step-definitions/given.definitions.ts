import { models as apiModels } from '@cornie-js/api-models';
import { Given } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';

import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { setRequestParameters } from '../../http/utils/actions/setRequestParameters';

function givenCreateUserRequest(this: OneGameApiWorld, requestAlias?: string) {
  const alias: string = requestAlias ?? defaultAlias;

  const userCreateQueryV1: apiModels.UserCreateQueryV1 = {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password({ length: 20 }),
  };

  setRequestParameters(this, 'createUser', alias, [{}, userCreateQueryV1]);
}

Given<OneGameApiWorld>(
  'a create user request',
  function (this: OneGameApiWorld) {
    givenCreateUserRequest.bind(this)();
  },
);

Given<OneGameApiWorld>(
  'a create user request as {string}',
  function (this: OneGameApiWorld, requestAlias: string) {
    givenCreateUserRequest.bind(this)(requestAlias);
  },
);
