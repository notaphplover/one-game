import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import {
  AppError,
  AppErrorKind,
  Builder,
  Handler,
  Spec,
} from '@cornie-js/backend-common';
import {
  User,
  UserCode,
  UserCodeCreateQuery,
  UserCodeFindQuery,
  UserCodeKind,
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
  let userCanCreateCodeSpecMock: jest.Mocked<Spec<[User, UserCodeCreateQuery]>>;
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
    userCanCreateCodeSpecMock = {
      isSatisfiedBy: jest.fn(),
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
      userCanCreateCodeSpecMock,
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

    describe('when called, and userCanCreateCodeSpec.isSatisfiedBy() returns false', () => {
      let userCodeKindFixture: UserCodeKind;
      let userCodeStringFixture: string;
      let uuidFixture: string;

      let result: unknown;

      beforeAll(async () => {
        userCodeKindFixture = UserCodeKind.resetPassword;
        userCodeStringFixture = 'code-fixture';
        uuidFixture = 'uuid-fixture';

        uuidProviderOutputPortMock.generateV4.mockReturnValueOnce(uuidFixture);
        randomHexStringBuilderMock.build.mockReturnValueOnce(
          userCodeStringFixture,
        );
        userCanCreateCodeSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

        try {
          await userCodeManagementInputPort.createFromUser(
            userFixture,
            userCodeKindFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should not call userCodeCreatedEventHandler.handle()', () => {
        expect(userCodeCreatedEventHandlerMock.handle).not.toHaveBeenCalled();
      });

      it('should throw an AppError of kind unprocessableOperation', () => {
        const expected: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: 'Unable to generate user code given the actual user state',
        };

        expect(result).toBeInstanceOf(AppError);
        expect(result).toStrictEqual(expect.objectContaining(expected));
      });
    });

    describe('when called, and userCanCreateCodeSpec.isSatisfiedBy() returns true', () => {
      let userCodeFixture: UserCode;
      let userCodeKindFixture: UserCodeKind;
      let userCodeStringFixture: string;
      let uuidFixture: string;

      let result: unknown;

      beforeAll(async () => {
        userCodeFixture = UserCodeFixtures.any;
        userCodeKindFixture = UserCodeKind.resetPassword;
        userCodeStringFixture = 'code-fixture';
        uuidFixture = 'uuid-fixture';

        uuidProviderOutputPortMock.generateV4.mockReturnValueOnce(uuidFixture);
        randomHexStringBuilderMock.build.mockReturnValueOnce(
          userCodeStringFixture,
        );
        userCanCreateCodeSpecMock.isSatisfiedBy.mockReturnValueOnce(true);
        userCodePersistenceOutputPortMock.create.mockResolvedValueOnce(
          userCodeFixture,
        );

        result = await userCodeManagementInputPort.createFromUser(
          userFixture,
          userCodeKindFixture,
        );
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
