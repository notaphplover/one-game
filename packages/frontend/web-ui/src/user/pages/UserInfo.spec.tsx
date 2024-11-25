import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../app/store/hooks');
jest.mock('../../common/hooks/useRedirectUnauthorized');
jest.mock('../hooks/useUserInfo');

import { models as apiModels } from '@cornie-js/api-models';
import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppSelector } from '../../app/store/hooks';
import { useUserInfo } from '../hooks/useUserInfo';
import { UserInfoStatus } from '../models/UserInfoStatus';
import { UserInfo } from './UserInfo';

describe(UserInfo.name, () => {
  describe('when called, and useUserInfo() returns status fetchingUser', () => {
    let authFixture: AuthenticatedAuthState | null;

    let useUserInfoResultFixture: jest.Mocked<ReturnType<typeof useUserInfo>>;

    let nameValue: string | null;

    beforeAll(() => {
      authFixture = null;
      useUserInfoResultFixture = [
        {
          form: {
            fields: {
              confirmPassword: null,
              email: null,
              name: null,
              password: null,
            },
            validation: {},
          },
          status: UserInfoStatus.fetchingUser,
        },
        {
          handlers: {
            onConfirmPasswordChanged: jest.fn(),
            onNameChanged: jest.fn(),
            onPasswordChanged: jest.fn(),
            onSubmit: jest.fn(),
          },
        },
      ];

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        authFixture,
      );

      (useUserInfo as jest.Mock<typeof useUserInfo>).mockReturnValueOnce(
        useUserInfoResultFixture,
      );

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <UserInfo />
        </MemoryRouter>,
      );

      const nameTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector(
          "[data-testid='user-info-form-text-name'] > div.MuiInputBase-root > input",
        ) as HTMLInputElement | null | undefined) ?? null;

      nameValue = nameTextFieldInput?.value ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useUserInfo()', () => {
      expect(useUserInfo).toHaveBeenCalledTimes(1);
      expect(useUserInfo).toHaveBeenCalledWith();
    });

    it('should have an empty name', () => {
      expect(nameValue).toBe('');
    });
  });

  describe('when called, and useUserInfo() returns status idle and usersV1MeResult Right', () => {
    let authFixture: AuthenticatedAuthState | null;
    let emailFixture: string;
    let nameFixture: string;
    let useUserInfoResultFixture: jest.Mocked<ReturnType<typeof useUserInfo>>;

    let nameValue: string | null;

    beforeAll(async () => {
      authFixture = null;
      emailFixture = 'email-fixture';
      nameFixture = 'name-fixture';

      const userDetailV1Fixture: apiModels.UserDetailV1 = {
        email: emailFixture,
      };

      const userV1Fixture: apiModels.UserV1 = {
        active: true,
        id: 'user-id-fixture',
        name: nameFixture,
      };

      useUserInfoResultFixture = [
        {
          form: {
            fields: {
              confirmPassword: null,
              email: userDetailV1Fixture.email,
              name: userV1Fixture.name,
              password: null,
            },
            validation: {},
          },
          status: UserInfoStatus.idle,
        },
        {
          handlers: {
            onConfirmPasswordChanged: jest.fn(),
            onNameChanged: jest.fn(),
            onPasswordChanged: jest.fn(),
            onSubmit: jest.fn(),
          },
        },
      ];

      (useAppSelector as jest.Mock<typeof useAppSelector>).mockReturnValueOnce(
        authFixture,
      );

      (useUserInfo as jest.Mock<typeof useUserInfo>).mockReturnValueOnce(
        useUserInfoResultFixture,
      );

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <UserInfo />
        </MemoryRouter>,
      );

      const nameTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector(
          "[data-testid='user-info-form-text-name'] > div.MuiInputBase-root > input",
        ) as HTMLInputElement | null | undefined) ?? null;

      nameValue = nameTextFieldInput?.value ?? null;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call useUserInfo()', () => {
      expect(useUserInfo).toHaveBeenCalledTimes(1);
      expect(useUserInfo).toHaveBeenCalledWith();
    });

    it('should have a user name', () => {
      expect(nameValue).toBe(nameFixture);
    });
  });
});
