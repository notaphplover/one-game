import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  MailDeliveryOptions,
  MailDeliveryOutputPort,
} from '@cornie-js/backend-application-mail';
import { Builder } from '@cornie-js/backend-common';
import { User, UserCode } from '@cornie-js/backend-user-domain/users';

import { UserCodeCreatedEventFixtures } from '../fixtures/UserCodeCreatedEventFixtures';
import { UserCodeCreatedEvent } from '../models/UserCodeCreatedEvent';
import { UserCodeCreatedEventHandler } from './UserCodeCreatedEventHandler';

describe(UserCodeCreatedEventHandler.name, () => {
  let mailDeliveryOutputPortMock: jest.Mocked<MailDeliveryOutputPort>;
  let userActivationMailDeliveryOptionsFromUserBuilderMock: jest.Mocked<
    Builder<MailDeliveryOptions, [User, UserCode]>
  >;

  let userCodeCreatedEventHandler: UserCodeCreatedEventHandler;

  beforeAll(() => {
    mailDeliveryOutputPortMock = {
      send: jest.fn(),
    };
    userActivationMailDeliveryOptionsFromUserBuilderMock = {
      build: jest.fn(),
    };

    userCodeCreatedEventHandler = new UserCodeCreatedEventHandler(
      mailDeliveryOutputPortMock,
      userActivationMailDeliveryOptionsFromUserBuilderMock,
    );
  });

  describe('.handle', () => {
    let userCodeCreatedEventFixture: UserCodeCreatedEvent;

    beforeAll(() => {
      userCodeCreatedEventFixture = UserCodeCreatedEventFixtures.any;
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

        result = await userCodeCreatedEventHandler.handle(
          userCodeCreatedEventFixture,
        );
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
          userCodeCreatedEventFixture.user,
          userCodeCreatedEventFixture.userCode,
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
