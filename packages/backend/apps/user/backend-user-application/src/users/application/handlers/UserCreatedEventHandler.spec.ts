import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import {
  MailDeliveryOptions,
  MailDeliveryOutputPort,
} from '@cornie-js/backend-application-mail';
import { Builder } from '@cornie-js/backend-common';
import {
  User,
  UserCode,
  UserCodeCreateQuery,
} from '@cornie-js/backend-user-domain/users';
import {
  UserCodeCreateQueryFixtures,
  UserCodeFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { UserCreatedEventFixtures } from '../fixtures/UserCreatedEventFixtures';
import { UserCodeContext } from '../models/UserCodeContext';
import { UserCreatedEvent } from '../models/UserCreatedEvent';
import { UserCodePersistenceOutputPort } from '../ports/output/UserCodePersistenceOutputPort';
import { UserCreatedEventHandler } from './UserCreatedEventHandler';

describe(UserCreatedEventHandler.name, () => {
  let mailDeliveryOutputPortMock: jest.Mocked<MailDeliveryOutputPort>;
  let randomHexStringBuilderMock: jest.Mocked<Builder<string, [number]>>;
  let userActivationMailDeliveryOptionsFromUserBuilderMock: jest.Mocked<
    Builder<MailDeliveryOptions, [User, UserCode]>
  >;
  let userCodeCreateQueryFromUserBuilderMock: jest.Mocked<
    Builder<UserCodeCreateQuery, [User, UuidContext & UserCodeContext]>
  >;
  let userCodePersistenceOutputPortMock: jest.Mocked<UserCodePersistenceOutputPort>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let userCreatedEventHandler: UserCreatedEventHandler;

  beforeAll(() => {
    mailDeliveryOutputPortMock = {
      send: jest.fn(),
    };
    randomHexStringBuilderMock = {
      build: jest.fn(),
    };
    userActivationMailDeliveryOptionsFromUserBuilderMock = {
      build: jest.fn(),
    };
    userCodeCreateQueryFromUserBuilderMock = {
      build: jest.fn(),
    };
    userCodePersistenceOutputPortMock = {
      create: jest.fn(),
    } as Partial<
      jest.Mocked<UserCodePersistenceOutputPort>
    > as jest.Mocked<UserCodePersistenceOutputPort>;
    uuidProviderOutputPortMock = {
      generateV4: jest.fn(),
    };

    userCreatedEventHandler = new UserCreatedEventHandler(
      mailDeliveryOutputPortMock,
      randomHexStringBuilderMock,
      userActivationMailDeliveryOptionsFromUserBuilderMock,
      userCodeCreateQueryFromUserBuilderMock,
      userCodePersistenceOutputPortMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.handle', () => {
    let userCreatedEventFixture: UserCreatedEvent;

    beforeAll(() => {
      userCreatedEventFixture = UserCreatedEventFixtures.any;
    });

    describe('when called', () => {
      let userCodeCreateQueryFixture: UserCodeCreateQuery;
      let userCodeFixture: UserCode;
      let uuidFixture: string;
      let userCodeCodeFixture: string;
      let mailDeliveryOptionsFixture: MailDeliveryOptions;

      let result: unknown;

      beforeAll(async () => {
        userCodeCreateQueryFixture = UserCodeCreateQueryFixtures.any;
        userCodeFixture = UserCodeFixtures.any;
        uuidFixture = 'uuid fixture';
        userCodeCodeFixture = userCodeFixture.code;
        mailDeliveryOptionsFixture = {
          from: 'mail@example.com',
          subject: 'subject',
          text: 'sample text',
          to: ['mail@example.com'],
        };

        userCodeCreateQueryFromUserBuilderMock.build.mockReturnValueOnce(
          userCodeCreateQueryFixture,
        );

        randomHexStringBuilderMock.build.mockReturnValueOnce(
          userCodeCodeFixture,
        );

        uuidProviderOutputPortMock.generateV4.mockReturnValueOnce(uuidFixture);

        userCodePersistenceOutputPortMock.create.mockResolvedValueOnce(
          userCodeFixture,
        );

        userActivationMailDeliveryOptionsFromUserBuilderMock.build.mockReturnValueOnce(
          mailDeliveryOptionsFixture,
        );

        mailDeliveryOutputPortMock.send.mockResolvedValueOnce(undefined);

        result = await userCreatedEventHandler.handle(userCreatedEventFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userCodeCreateQueryFromUserBuilder.build()', () => {
        const expectedContext: UserCodeContext & UuidContext = {
          userCode: userCodeCodeFixture,
          uuid: uuidFixture,
        };

        expect(
          userCodeCreateQueryFromUserBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          userCodeCreateQueryFromUserBuilderMock.build,
        ).toHaveBeenCalledWith(userCreatedEventFixture.user, expectedContext);
      });

      it('should call randomHexStringBuilder.build()', () => {
        expect(randomHexStringBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(randomHexStringBuilderMock.build).toHaveBeenCalledWith(
          expect.any(Number),
        );
      });

      it('should call uuidProviderOutputPort.generateV4()', () => {
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledTimes(1);
        expect(uuidProviderOutputPortMock.generateV4).toHaveBeenCalledWith();
      });

      it('should call userCodePersistenceOutputPort.create()', () => {
        expect(userCodePersistenceOutputPortMock.create).toHaveBeenCalledTimes(
          1,
        );
        expect(userCodePersistenceOutputPortMock.create).toHaveBeenCalledWith(
          userCodeCreateQueryFixture,
        );
      });

      it('should call userActivationMailDeliveryOptionsFromUserBuilder.build()', () => {
        expect(
          userActivationMailDeliveryOptionsFromUserBuilderMock.build,
        ).toHaveBeenCalledTimes(1);
        expect(
          userActivationMailDeliveryOptionsFromUserBuilderMock.build,
        ).toHaveBeenCalledWith(userCreatedEventFixture.user, userCodeFixture);
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
