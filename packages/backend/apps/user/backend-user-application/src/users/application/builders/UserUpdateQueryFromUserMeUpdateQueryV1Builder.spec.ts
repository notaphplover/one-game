import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { UserUpdateQuery } from '@cornie-js/backend-user-domain/users';

import { UuidContext } from '../../../foundation/common/application/models/UuidContext';
import { BcryptHashProviderOutputPort } from '../../../foundation/hash/application/ports/output/BcryptHashProviderOutputPort';
import { UserMeUpdateQueryV1Fixtures } from '../fixtures/UserMeUpdateQueryV1Fixtures';
import { UserUpdateQueryFromUserMeUpdateQueryV1Builder } from './UserUpdateQueryFromUserMeUpdateQueryV1Builder';

describe(UserUpdateQueryFromUserMeUpdateQueryV1Builder, () => {
  let bcryptHashProviderOutputPortMock: jest.Mocked<BcryptHashProviderOutputPort>;

  let userUpdateQueryFromUserMeUpdateQueryV1Builder: UserUpdateQueryFromUserMeUpdateQueryV1Builder;

  beforeAll(() => {
    bcryptHashProviderOutputPortMock = { hash: jest.fn() } as Partial<
      jest.Mocked<BcryptHashProviderOutputPort>
    > as jest.Mocked<BcryptHashProviderOutputPort>;

    userUpdateQueryFromUserMeUpdateQueryV1Builder =
      new UserUpdateQueryFromUserMeUpdateQueryV1Builder(
        bcryptHashProviderOutputPortMock,
      );
  });

  describe('.build', () => {
    describe('having a UserMeUpdateQueryV1 with active', () => {
      let userMeUpdateQueryV1Fixture: apiModels.UserMeUpdateQueryV1;

      beforeAll(() => {
        userMeUpdateQueryV1Fixture = UserMeUpdateQueryV1Fixtures.withActive;
      });

      describe('when called', () => {
        let uuidContextFixture: UuidContext;

        let result: unknown;

        beforeAll(async () => {
          uuidContextFixture = {
            uuid: '83073aec-b81b-4107-97f9-baa46de5dd40',
          };

          result = await userUpdateQueryFromUserMeUpdateQueryV1Builder.build(
            userMeUpdateQueryV1Fixture,
            uuidContextFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a UserUpdateQuery', () => {
          const expected: UserUpdateQuery & Record<string, unknown> = {
            active: userMeUpdateQueryV1Fixture.active as true,

            userFindQuery: {
              id: uuidContextFixture.uuid,
            },
          };

          expect(result).toStrictEqual(expect.objectContaining(expected));
        });
      });
    });

    describe('having a UserMeUpdateQueryV1 with name', () => {
      let userMeUpdateQueryV1Fixture: apiModels.UserMeUpdateQueryV1;

      beforeAll(() => {
        userMeUpdateQueryV1Fixture = UserMeUpdateQueryV1Fixtures.withName;
      });

      describe('when called', () => {
        let uuidContextFixture: UuidContext;

        let result: unknown;

        beforeAll(async () => {
          uuidContextFixture = {
            uuid: '83073aec-b81b-4107-97f9-baa46de5dd40',
          };

          result = await userUpdateQueryFromUserMeUpdateQueryV1Builder.build(
            userMeUpdateQueryV1Fixture,
            uuidContextFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return a UserUpdateQuery', () => {
          const expected: UserUpdateQuery & Record<string, unknown> = {
            name: userMeUpdateQueryV1Fixture.name as string,

            userFindQuery: {
              id: uuidContextFixture.uuid,
            },
          };

          expect(result).toStrictEqual(expect.objectContaining(expected));
        });
      });
    });
  });
});
