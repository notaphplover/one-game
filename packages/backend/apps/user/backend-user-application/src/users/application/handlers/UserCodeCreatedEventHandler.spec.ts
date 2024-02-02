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
  let passwordResetMailDeliveryOptionsFromUserBuilderMock: jest.Mocked<
    Builder<MailDeliveryOptions, [User, UserCode]>
  >;
  let userActivationMailDeliveryOptionsFromUserBuilderMock: jest.Mocked<
    Builder<MailDeliveryOptions, [User, UserCode]>
  >;

  let userCodeCreatedEventHandler: UserCodeCreatedEventHandler;

  beforeAll(() => {
    mailDeliveryOutputPortMock = {
      send: jest.fn(),
    };
    passwordResetMailDeliveryOptionsFromUserBuilderMock = {
      build: jest.fn(),
    };
    userActivationMailDeliveryOptionsFromUserBuilderMock = {
      build: jest.fn(),
    };

    userCodeCreatedEventHandler = new UserCodeCreatedEventHandler(
      mailDeliveryOutputPortMock,
      passwordResetMailDeliveryOptionsFromUserBuilderMock,
      userActivationMailDeliveryOptionsFromUserBuilderMock,
    );
  });

  describe('.handle', () => {
    describe('having a UserCodeCreatedEvent with a non active user', () => {
      let userCodeCreatedEventFixture: UserCodeCreatedEvent;

      beforeAll(() => {
        userCodeCreatedEventFixture =
          UserCodeCreatedEventFixtures.withUserWithActiveFalse;
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

    describe('having a UserCodeCreatedEvent with an active user', () => {
      let userCodeCreatedEventFixture: UserCodeCreatedEvent;

      beforeAll(() => {
        userCodeCreatedEventFixture =
          UserCodeCreatedEventFixtures.withUserWithActiveTrue;
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

          passwordResetMailDeliveryOptionsFromUserBuilderMock.build.mockReturnValueOnce(
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

        it('should call passwordResetMailDeliveryOptionsFromUserBuilder.build()', () => {
          expect(
            passwordResetMailDeliveryOptionsFromUserBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            passwordResetMailDeliveryOptionsFromUserBuilderMock.build,
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
});
