import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import { Builder, Handler } from '@cornie-js/backend-common';
import {
  User,
  UserCode,
  UserCodeFindQuery,
} from '@cornie-js/backend-user-domain/users';
import {
  UserCodeFixtures,
  UserFixtures,
} from '@cornie-js/backend-user-domain/users/fixtures';

import { UserCodeCreatedEvent } from '../../models/UserCodeCreatedEvent';
import { UserCodePersistenceOutputPort } from '../output/UserCodePersistenceOutputPort';
import { UserCodeManagementInputPort } from './UserCodeManagementInputPort';

describe(UserCodeManagementInputPort.name, () => {
  let randomHexStringBuilderMock: jest.Mocked<Builder<string, [number]>>;
  let userCodeCreatedEventHandlerMock: jest.Mocked<
    Handler<[UserCodeCreatedEvent], void>
  >;
  let userCodePersistenceOutputPortMock: jest.Mocked<UserCodePersistenceOutputPort>;
  let uuidProviderOutputPortMock: jest.Mocked<UuidProviderOutputPort>;

  let userCodeManagementInputPort: UserCodeManagementInputPort;

  beforeAll(() => {
    randomHexStringBuilderMock = {
      build: jest.fn(),
    };
    userCodeCreatedEventHandlerMock = {
      handle: jest.fn(),
    };
    userCodePersistenceOutputPortMock = {
      create: jest.fn(),
      delete: jest.fn(),
    } as Partial<
      jest.Mocked<UserCodePersistenceOutputPort>
    > as jest.Mocked<UserCodePersistenceOutputPort>;
    uuidProviderOutputPortMock = {
      generateV4: jest.fn(),
    };

    userCodeManagementInputPort = new UserCodeManagementInputPort(
      randomHexStringBuilderMock,
      userCodeCreatedEventHandlerMock,
      userCodePersistenceOutputPortMock,
      uuidProviderOutputPortMock,
    );
  });

  describe('.createFromUser', () => {
    let userFixture: User;

    beforeAll(() => {
      userFixture = UserFixtures.any;
    });

    describe('when called', () => {
      let userCodeFixture: UserCode;
      let userCodeStringFixture: string;
      let uuidFixture: string;

      let result: unknown;

      beforeAll(async () => {
        userCodeFixture = UserCodeFixtures.any;
        userCodeStringFixture = 'code-fixture';
        uuidFixture = 'uuid-fixture';

        uuidProviderOutputPortMock.generateV4.mockReturnValueOnce(uuidFixture);
        randomHexStringBuilderMock.build.mockReturnValueOnce(
          userCodeStringFixture,
        );
        userCodePersistenceOutputPortMock.create.mockResolvedValueOnce(
          userCodeFixture,
        );

        result = await userCodeManagementInputPort.createFromUser(userFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userCodeCreatedEventHandler.handle()', () => {
        const expected: UserCodeCreatedEvent = {
          user: userFixture,
          userCode: userCodeFixture,
        };

        expect(userCodeCreatedEventHandlerMock.handle).toHaveBeenCalledTimes(1);
        expect(userCodeCreatedEventHandlerMock.handle).toHaveBeenCalledWith(
          expected,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.deleteFromUser', () => {
    let userFixture: User;

    beforeAll(() => {
      userFixture = UserFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        userCodePersistenceOutputPortMock.delete.mockResolvedValueOnce(
          undefined,
        );

        result = await userCodeManagementInputPort.deleteFromUser(userFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userCodePersistenceOutputPort.delete()', () => {
        const expectedUserCodeFindQuery: UserCodeFindQuery = {
          userId: userFixture.id,
        };

        expect(userCodePersistenceOutputPortMock.delete).toHaveBeenCalledTimes(
          1,
        );
        expect(userCodePersistenceOutputPortMock.delete).toHaveBeenCalledWith(
          expectedUserCodeFindQuery,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
