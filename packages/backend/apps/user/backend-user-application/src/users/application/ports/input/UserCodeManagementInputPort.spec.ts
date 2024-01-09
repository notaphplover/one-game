import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { UuidProviderOutputPort } from '@cornie-js/backend-app-uuid';
import { AppError, AppErrorKind, Builder } from '@cornie-js/backend-common';
import {
  User,
  UserCanCreateCodeSpec,
  UserCode,
  UserCodeFindQuery,
} from '@cornie-js/backend-user-domain/users';
import { UserFixtures } from '@cornie-js/backend-user-domain/users/fixtures';

import { UserCodePersistenceOutputPort } from '../output/UserCodePersistenceOutputPort';
import { UserCodeManagementInputPort } from './UserCodeManagementInputPort';

describe(UserCodeManagementInputPort.name, () => {
  let randomHexStringBuilderMock: jest.Mocked<Builder<string, [number]>>;
  let userCanCreateCodeSpecMock: jest.Mocked<UserCanCreateCodeSpec>;
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
      let result: unknown;

      beforeAll(async () => {
        userCanCreateCodeSpecMock.isSatisfiedBy.mockReturnValueOnce(false);

        try {
          await userCodeManagementInputPort.createFromUser(userFixture);
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userCanCreateCodeSpec.isSatisfiedBy()', () => {
        expect(userCanCreateCodeSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(userCanCreateCodeSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          userFixture,
        );
      });

      it('should throw an Error', () => {
        const expectedErrorProperties: Partial<AppError> = {
          kind: AppErrorKind.unprocessableOperation,
          message: 'Unable to perform operation',
        };

        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });

    describe('when called, and userCanCreateCodeSpec.isSatisfiedBy() returns true', () => {
      let userCodeFixture: UserCode;
      let userCodeStringFixture: string;
      let uuidFixture: string;

      let result: unknown;

      beforeAll(async () => {
        userCodeStringFixture = 'code-fixture';
        uuidFixture = 'uuid-fixture';

        userCanCreateCodeSpecMock.isSatisfiedBy.mockReturnValueOnce(true);
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

      it('should call userCanCreateCodeSpec.isSatisfiedBy()', () => {
        expect(userCanCreateCodeSpecMock.isSatisfiedBy).toHaveBeenCalledTimes(
          1,
        );
        expect(userCanCreateCodeSpecMock.isSatisfiedBy).toHaveBeenCalledWith(
          userFixture,
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
