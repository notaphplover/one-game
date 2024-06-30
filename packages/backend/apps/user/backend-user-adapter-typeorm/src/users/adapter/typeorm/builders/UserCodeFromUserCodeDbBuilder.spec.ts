import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { UserCode, UserCodeKind } from '@cornie-js/backend-user-domain/users';

import { UserCodeDbFixtures } from '../fixtures/UserCodeDbFixtures';
import { UserCodeDb } from '../models/UserCodeDb';
import { UserCodeKindDb } from '../models/UserCodeKindDb';
import { UserCodeFromUserDbCodeBuilder } from './UserCodeFromUserCodeDbBuilder';

describe(UserCodeFromUserDbCodeBuilder.name, () => {
  let userCodeKindFromUserCodeKindDbBuilderMock: jest.Mocked<
    Builder<UserCodeKind, [UserCodeKindDb]>
  >;

  let userCodeFromUserCodeDbBuilder: UserCodeFromUserDbCodeBuilder;

  beforeAll(() => {
    userCodeKindFromUserCodeKindDbBuilderMock = {
      build: jest.fn(),
    };

    userCodeFromUserCodeDbBuilder = new UserCodeFromUserDbCodeBuilder(
      userCodeKindFromUserCodeKindDbBuilderMock,
    );
  });

  describe('.build', () => {
    describe('having a UserCode with kind null', () => {
      let userCodeDbFixture: UserCodeDb;

      beforeAll(() => {
        userCodeDbFixture = UserCodeDbFixtures.withKindNull;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = userCodeFromUserCodeDbBuilder.build(userCodeDbFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should not call userCodeKindFromUserCodeKindDbBuilder.build()', () => {
          expect(
            userCodeKindFromUserCodeKindDbBuilderMock.build,
          ).not.toHaveBeenCalled();
        });

        it('should return a UserCode', () => {
          const expected: UserCode = {
            code: userCodeDbFixture.code,
            kind: UserCodeKind.registerConfirm,
            userId: userCodeDbFixture.userId,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });

    describe('having a UserCode with kind distinct than null', () => {
      let userCodeDbFixture: UserCodeDb;

      beforeAll(() => {
        userCodeDbFixture = UserCodeDbFixtures.withKindResetPassword;
      });

      describe('when called', () => {
        let userCodeKindFixture: UserCodeKind;

        let result: unknown;

        beforeAll(() => {
          userCodeKindFixture = UserCodeKind.resetPassword;

          userCodeKindFromUserCodeKindDbBuilderMock.build.mockReturnValueOnce(
            userCodeKindFixture,
          );

          result = userCodeFromUserCodeDbBuilder.build(userCodeDbFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call userCodeKindFromUserCodeKindDbBuilder.build()', () => {
          expect(
            userCodeKindFromUserCodeKindDbBuilderMock.build,
          ).toHaveBeenCalledTimes(1);
          expect(
            userCodeKindFromUserCodeKindDbBuilderMock.build,
          ).toHaveBeenCalledWith(userCodeDbFixture.kind);
        });

        it('should return a UserCode', () => {
          const expected: UserCode = {
            code: userCodeDbFixture.code,
            kind: userCodeKindFixture,
            userId: userCodeDbFixture.userId,
          };

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });
});
