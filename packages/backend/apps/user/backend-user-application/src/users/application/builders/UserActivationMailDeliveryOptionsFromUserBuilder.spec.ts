import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  Environment,
  EnvironmentService,
  MailConfig,
} from '@cornie-js/backend-app-user-env';
import { MailDeliveryOptions } from '@cornie-js/backend-application-mail';
import { User, UserCode } from '@cornie-js/backend-user-domain/users';
import {
  UserCodeFixtures,
  UserFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { UserActivationMailDeliveryOptionsFromUserBuilder } from './UserActivationMailDeliveryOptionsFromUserBuilder';

describe(UserActivationMailDeliveryOptionsFromUserBuilder.name, () => {
  let environmentFixture: Environment;

  let environmentServiceMock: jest.Mocked<EnvironmentService>;
  let userActivationMailDeliveryOptionsFromUserBuilder: UserActivationMailDeliveryOptionsFromUserBuilder;

  beforeAll(() => {
    environmentFixture = {
      frontendBaseUrl: 'https://frontend.com',
      mailConfig: {
        defaultAddress: 'default@example.com',
      } as Partial<MailConfig> as MailConfig,
    } as Partial<Environment> as Environment;

    environmentServiceMock = {
      getEnvironment: jest.fn(),
    } as Partial<
      jest.Mocked<EnvironmentService>
    > as jest.Mocked<EnvironmentService>;

    environmentServiceMock.getEnvironment.mockReturnValue(environmentFixture);

    userActivationMailDeliveryOptionsFromUserBuilder =
      new UserActivationMailDeliveryOptionsFromUserBuilder(
        environmentServiceMock,
      );
  });

  describe('.build', () => {
    let userFixture: User;
    let userCodeFixture: UserCode;

    beforeAll(() => {
      userFixture = UserFixtures.any;
      userCodeFixture = UserCodeFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = userActivationMailDeliveryOptionsFromUserBuilder.build(
          userFixture,
          userCodeFixture,
        );
      });

      it('should return MailDeliveryOptions', () => {
        const expected: MailDeliveryOptions = {
          from: environmentFixture.mailConfig.defaultAddress,
          html: expect.stringContaining(
            userCodeFixture.code,
          ) as unknown as string,
          subject: expect.any(String) as unknown as string,
          to: [userFixture.email],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
