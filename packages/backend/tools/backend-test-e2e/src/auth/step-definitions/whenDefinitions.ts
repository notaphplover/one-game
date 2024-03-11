import { HttpClient } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { When } from '@cucumber/cucumber';

import { defaultAlias } from '../../foundation/application/data/defaultAlias';
import { OneGameApiWorld } from '../../http/models/OneGameApiWorld';
import { sendRequest } from '../../http/utils/actions/sendRequest';
import { setRequestParameters } from '../../http/utils/actions/setRequestParameters';
import { getRequestParametersOrFail } from '../../http/utils/calculations/getRequestOrFail';
import { deleteMaildevServerEmailsToAddress } from '../../mail/actions/deleteMaildevServerEmailsToUser';
import { getMaildevServerEmailsToUser } from '../../mail/actions/getMaildevServerEmailsToUser';
import { getUserCodeFromUserActivationMail } from '../../mail/actions/getUserCodeFromUserActivationMail';
import { MaildevMail } from '../../mail/types/MaildevMail';

export async function whenCreateCodeAuthRequestIsSendFromUserActivationMail(
  this: OneGameApiWorld,
  requestAlias?: string | undefined,
): Promise<void> {
  const processedRequestAlias: string = requestAlias ?? defaultAlias;

  const [, userCreateQueryV1]: Parameters<HttpClient['createUser']> =
    getRequestParametersOrFail(this, 'createUser', processedRequestAlias);

  const userMails: MaildevMail[] = await getMaildevServerEmailsToUser(
    userCreateQueryV1.email,
  );

  const userCode: string | undefined = userMails.reduce(
    (
      userCode: string | undefined,
      mailDevMail: MaildevMail,
    ): string | undefined =>
      userCode ?? getUserCodeFromUserActivationMail(mailDevMail),
    undefined,
  );

  if (userCode === undefined) {
    throw new Error('Expecting a user code from user mails');
  }

  await deleteMaildevServerEmailsToAddress(userCreateQueryV1.email);

  const authCreateQuery: apiModels.CodeAuthCreateQueryV2 = {
    code: userCode,
    kind: 'code',
  };

  const requestParameters: Parameters<HttpClient['createAuthV2']> = [
    {},
    authCreateQuery,
  ];

  setRequestParameters.bind(this)(
    'createAuthV2',
    processedRequestAlias,
    requestParameters,
  );

  await whenCreateAuthRequestIsSend.bind(this)(requestAlias);
}

export async function whenCreateAuthRequestIsSend(
  this: OneGameApiWorld,
  requestAlias?: string,
): Promise<void> {
  await sendRequest.bind(this)('createAuthV2', requestAlias);
}

When<OneGameApiWorld>(
  'the create auth request is sent',
  async function (this: OneGameApiWorld): Promise<void> {
    await whenCreateAuthRequestIsSend.bind(this)();
  },
);

When<OneGameApiWorld>(
  'the create auth request is sent as {string}',
  async function (this: OneGameApiWorld, requestAlias: string): Promise<void> {
    await whenCreateAuthRequestIsSend.bind(this)(requestAlias);
  },
);
