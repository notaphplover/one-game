import { useEffect, useState } from 'react';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { createAuthByToken } from '../../app/store/thunk/createAuthByToken';
import { RegisterConfirmStatus } from '../models/RegisterConfirmStatus';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { selectAuthAllToken } from '../../app/store/features/authSlice';
import { RegisterConfirmSerializedResponse } from '../../common/http/models/RegisterConfirmSerializedResponse';
import { RegisterConfirmResponse } from '../../common/http/models/RegisterConfirmResponse';
import { UseRegisterConfirmResult } from '../models/UseRegisterConfirmResult';
import { AuthenticatedAuthState } from '../../app/store/helpers/models/AuthState';

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
  const auth: AuthenticatedAuthState | null =
    useAppSelector(selectAuthAllToken);

  useEffect(() => {
    void (async () => {
      switch (status) {
        case RegisterConfirmStatus.idle:
          setStatus(RegisterConfirmStatus.pending);

          if (codeParam === null) {
            setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
            setStatus(RegisterConfirmStatus.rejected);
          } else {
            await dispatch(createAuthByToken(codeParam));
          }
          break;
        case RegisterConfirmStatus.pending:
          if (auth !== null) {
            try {
              const response: RegisterConfirmSerializedResponse =
                await updateUserMe(auth.token);

              switch (response.statusCode) {
                case 200:
                  setStatus(RegisterConfirmStatus.fulfilled);
                  break;
                case 401:
                  setErrorMessage(UNAUTHORIZED_ERROR_MESSAGE);
                  setStatus(RegisterConfirmStatus.rejected);
                  break;
                default:
                  setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
                  setStatus(RegisterConfirmStatus.rejected);
              }
            } catch (_) {
              setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
              setStatus(RegisterConfirmStatus.rejected);
            }
          } else {
            setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
            setStatus(RegisterConfirmStatus.rejected);
          }
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
    status,
    errorMessage,
  };
};
