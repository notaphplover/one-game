import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { Builder } from '@cornie-js/backend-common';
import { User, UserFindQuery } from '@cornie-js/backend-user-domain/users';
import { UserFixtures } from '@cornie-js/backend-user-domain/users/fixtures';

import { UserDetailV1Fixtures } from '../../fixtures/UserDetailV1Fixtures';
import { UserPersistenceOutputPort } from '../output/UserPersistenceOutputPort';
import { UserDetailManagementInputPort } from './UserDetailManagementInputPort';

describe(UserDetailManagementInputPort.name, () => {
  let userDetailV1FromUserBuilderMock: jest.Mocked<
    Builder<apiModels.UserDetailV1, [User]>
  >;
  let userPersistenceOutputPortMock: jest.Mocked<UserPersistenceOutputPort>;

  let userDetailManagementInputPort: UserDetailManagementInputPort;

  beforeAll(() => {
    userDetailV1FromUserBuilderMock = {
      build: jest.fn(),
    };

    userPersistenceOutputPortMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<UserPersistenceOutputPort>
    > as jest.Mocked<UserPersistenceOutputPort>;

    userDetailManagementInputPort = new UserDetailManagementInputPort(
      userDetailV1FromUserBuilderMock,
      userPersistenceOutputPortMock,
    );
  });

  describe('.findOne()', () => {
    let userIdFixture: string;

    beforeAll(() => {
      userIdFixture = 'user-id-fixture';
    });

    describe('when called, and userPersistenceOutputPort.findOne() returns User', () => {
      let userFixture: User;
      let userDetailV1Fixture: apiModels.UserDetailV1;

      let result: unknown;

      beforeAll(async () => {
        userFixture = UserFixtures.any;
        userDetailV1Fixture = UserDetailV1Fixtures.any;

        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(
          userFixture,
        );

        userDetailV1FromUserBuilderMock.build.mockReturnValueOnce(
          userDetailV1Fixture,
        );

        result = await userDetailManagementInputPort.findOne(userIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userPersistenceOutputPort.findOne()', () => {
        const expectedUserFindQuery: UserFindQuery = {
          id: userIdFixture,
        };

        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedUserFindQuery,
        );
      });

      it('should call userDetailV1FromUserBuilder.build()', () => {
        expect(userDetailV1FromUserBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(userDetailV1FromUserBuilderMock.build).toHaveBeenCalledWith(
          userFixture,
        );
      });

      it('should return UserDetailV1', () => {
        expect(result).toBe(userDetailV1Fixture);
      });
    });

    describe('when called, and userPersistenceOutputPort.findOne() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        userPersistenceOutputPortMock.findOne.mockResolvedValueOnce(undefined);

        result = await userDetailManagementInputPort.findOne(userIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call userPersistenceOutputPort.findOne()', () => {
        const expectedUserFindQuery: UserFindQuery = {
          id: userIdFixture,
        };

        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledTimes(1);
        expect(userPersistenceOutputPortMock.findOne).toHaveBeenCalledWith(
          expectedUserFindQuery,
        );
      });

      it('should not call userDetailV1FromUserBuilder.build()', () => {
        expect(userDetailV1FromUserBuilderMock.build).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
