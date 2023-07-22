import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  MailDeliveryOptions,
  MailDeliveryOutputPort,
} from '@cornie-js/backend-application-mail';
import { Builder } from '@cornie-js/backend-common';
import { User, UserCode } from '@cornie-js/backend-user-domain/users';

import { UserCreatedEventFixtures } from '../fixtures/UserCreatedEventFixtures';
import { UserCreatedEvent } from '../models/UserCreatedEvent';
import { UserCreatedEventHandler } from './UserCreatedEventHandler';

describe(UserCreatedEventHandler.name, () => {
  let mailDeliveryOutputPortMock: jest.Mocked<MailDeliveryOutputPort>;
  let userActivationMailDeliveryOptionsFromUserBuilderMock: jest.Mocked<
    Builder<MailDeliveryOptions, [User, UserCode]>
  >;

  let userCreatedEventHandler: UserCreatedEventHandler;

  beforeAll(() => {
    mailDeliveryOutputPortMock = {
      send: jest.fn(),
    };
    userActivationMailDeliveryOptionsFromUserBuilderMock = {
      build: jest.fn(),
    };

    userCreatedEventHandler = new UserCreatedEventHandler(
      mailDeliveryOutputPortMock,
      userActivationMailDeliveryOptionsFromUserBuilderMock,
    );
  });

  describe('.handle', () => {
    let userCreatedEventFixture: UserCreatedEvent;

    beforeAll(() => {
      userCreatedEventFixture = UserCreatedEventFixtures.any;
    });

    describe('when called', () => {
      let mailDeliveryOptionsFixture: MailDeliveryOptions;

      let result: unknown;

      beforeAll(async () => {
        mailDeliveryOptionsFixture = {
          from: 'mail@example.com',
          subject: 'subject',
          text: 'sample text',
          to: ['mail@example.com'],
        };

        userActivationMailDeliveryOptionsFromUserBuilderMock.build.mockReturnValueOnce(
          mailDeliveryOptionsFixture,
        );

        mailDeliveryOutputPortMock.send.mockResolvedValueOnce(undefined);

        result = await userCreatedEventHandler.handle(userCreatedEventFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userActivationMailDeliveryOptionsFromUserBuilder.build()', () => {
        expect(
          userActivationMailDeliveryOptionsFromUserBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          userActivationMailDeliveryOptionsFromUserBuilderMock.build,
        ).toHaveBeenCalledWith(
          userCreatedEventFixture.user,
          userCreatedEventFixture.userCode,
        );
      });

      it('should call mailDeliveryOutputPort.send()', () => {
        expect(mailDeliveryOutputPortMock.send).toHaveBeenCalledTimes(1);
        expect(mailDeliveryOutputPortMock.send).toHaveBeenCalledWith(
          mailDeliveryOptionsFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
