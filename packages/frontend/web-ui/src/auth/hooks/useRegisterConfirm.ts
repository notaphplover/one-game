import { useEffect, useState } from 'react';

import { selectAuthenticatedAuth } from '../../app/store/features/authSlice';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { createAuthByToken } from '../../app/store/thunk/createAuthByToken';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { OK, UNAUTHORIZED } from '../../common/http/helpers/httpCodes';
import { RegisterConfirmResponse } from '../../common/http/models/RegisterConfirmResponse';
import { RegisterConfirmSerializedResponse } from '../../common/http/models/RegisterConfirmSerializedResponse';
import { httpClient } from '../../common/http/services/httpClient';
import { RegisterConfirmStatus } from '../models/RegisterConfirmStatus';
import { UseRegisterConfirmResult } from '../models/UseRegisterConfirmResult';

const CODE_QUERY_PARAM: string = 'code';
export const UNEXPECTED_ERROR_MESSAGE: string = 'Unexpected error.';
export const UNAUTHORIZED_ERROR_MESSAGE: string = 'Unauthorized error.';

export const useRegisterConfirm = (): UseRegisterConfirmResult => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<RegisterConfirmStatus>(
    RegisterConfirmStatus.idle,
  );

  const url: URL = new URL(window.location.href);
  const codeParam: string | null = url.searchParams.get(CODE_QUERY_PARAM);

  const dispatch = useAppDispatch();
  const auth: AuthenticatedAuthState | null = useAppSelector(
    selectAuthenticatedAuth,
  );

  const handleResponse: (
    response: RegisterConfirmSerializedResponse,
  ) => void = (response: RegisterConfirmSerializedResponse): void => {
    switch (response.statusCode) {
      case OK:
        setStatus(RegisterConfirmStatus.fulfilled);
        break;
      case UNAUTHORIZED:
        setErrorMessage(UNAUTHORIZED_ERROR_MESSAGE);
        setStatus(RegisterConfirmStatus.rejected);
        break;
      default:
        setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
        setStatus(RegisterConfirmStatus.rejected);
    }
  };

  useEffect(() => {
    void (async () => {
      switch (status) {
        case RegisterConfirmStatus.idle:
          if (codeParam === null) {
            setStatus(RegisterConfirmStatus.rejected);
            setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
          } else {
            setStatus(RegisterConfirmStatus.pending);
            await dispatch(createAuthByToken(codeParam));
          }
          break;
        case RegisterConfirmStatus.pending:
          if (auth !== null) {
            try {
              const response: RegisterConfirmSerializedResponse =
                await updateUserMe(auth.accessToken);

              handleResponse(response);
            } catch (_error: unknown) {
              setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
              setStatus(RegisterConfirmStatus.rejected);
            }
          }
          break;
        default:
          break;
      }
    })();
  }, [auth, status]);

  const updateUserMe = async (
    token: string,
  ): Promise<RegisterConfirmSerializedResponse> => {
    const response: RegisterConfirmResponse =
      await httpClient.endpoints.updateUserMe(
        {
          authorization: `Bearer ${token}`,
        },
        {
          active: true,
        },
      );
    return buildSerializableResponse(response);
  };

  return {
    errorMessage,
    status,
  };
};
