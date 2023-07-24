import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { UserCodeFindQuery } from '@cornie-js/backend-user-domain/users';

import { UserUpdatedEventFixtures } from '../fixtures/UserUpdatedEventFixtures';
import { UserUpdatedEvent } from '../models/UserUpdatedEvent';
import { UserCodePersistenceOutputPort } from '../ports/output/UserCodePersistenceOutputPort';
import { UserUpdatedEventHandler } from './UserUpdatedEventHandler';

describe(UserUpdatedEventHandler.name, () => {
  let userCodePersistenceOutputPortMock: jest.Mocked<UserCodePersistenceOutputPort>;

  let userUpdatedEventHandler: UserUpdatedEventHandler;

  beforeAll(() => {
    userCodePersistenceOutputPortMock = {
      delete: jest.fn(),
    } as Partial<
      jest.Mocked<UserCodePersistenceOutputPort>
    > as jest.Mocked<UserCodePersistenceOutputPort>;

    userUpdatedEventHandler = new UserUpdatedEventHandler(
      userCodePersistenceOutputPortMock,
    );
  });

  describe('.handle', () => {
    describe.each<[string, UserUpdatedEvent]>([
      [
        'with an already active user',
        UserUpdatedEventFixtures.withUserBeforeUpdateActive,
      ],
      [
        'with a user update query with no active field',
        UserUpdatedEventFixtures.withUserUpdateQueryWithNoActive,
      ],
    ])(
      'having a UserUpdatedEvent %s',
      (_: string, userUpdatedEventFixture: UserUpdatedEvent) => {
        describe('when called', () => {
          let result: unknown;

          beforeAll(async () => {
            result = await userUpdatedEventHandler.handle(
              userUpdatedEventFixture,
            );
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should not call userCodePersistenceOutputPort.delete()', () => {
            expect(
              userCodePersistenceOutputPortMock.delete,
            ).not.toHaveBeenCalled();
          });

          it('should return undefined', () => {
            expect(result).toBeUndefined();
          });
        });
      },
    );

    describe('having a UserUpdatedEvent with a user not active and a user update query with active', () => {
      let userUpdatedEventFixture: UserUpdatedEvent;

      beforeAll(() => {
        userUpdatedEventFixture =
          UserUpdatedEventFixtures.withUserBeforeUpdateActiveFalseAndUserUpdateQueryWithActive;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(async () => {
          userCodePersistenceOutputPortMock.delete.mockResolvedValueOnce(
            undefined,
          );

          result = await userUpdatedEventHandler.handle(
            userUpdatedEventFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userCodePersistenceOutputPort.delete()', () => {
          const expectedUserCodeFindQuery: UserCodeFindQuery = {
            userId: userUpdatedEventFixture.userBeforeUpdate.id,
          };

          expect(
            userCodePersistenceOutputPortMock.delete,
          ).toHaveBeenCalledTimes(1);
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
});
