import { useEffect, useState } from 'react';

import { selectAuth } from '../../app/store/features/authSlice';
import { AuthState } from '../../app/store/helpers/models/AuthState';
import { AuthStateStatus } from '../../app/store/helpers/models/AuthStateStatus';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { createAuthByToken } from '../../app/store/thunk/createAuthByToken';
import { useUrlLikeLocation } from '../../common/hooks/useUrlLikeLocation';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { OK, UNAUTHORIZED } from '../../common/http/helpers/httpCodes';
import { RegisterConfirmResponse } from '../../common/http/models/RegisterConfirmResponse';
import { RegisterConfirmSerializedResponse } from '../../common/http/models/RegisterConfirmSerializedResponse';
import { httpClient } from '../../common/http/services/httpClient';
import { UrlLikeLocation } from '../../common/models/UrlLikeLocation';
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

  const location: UrlLikeLocation = useUrlLikeLocation();
  const codeParam: string | null = location.searchParams.get(CODE_QUERY_PARAM);

  const dispatch = useAppDispatch();
  const auth: AuthState = useAppSelector(selectAuth);

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
          switch (auth.status) {
            case AuthStateStatus.authenticated:
              try {
                const response: RegisterConfirmSerializedResponse =
                  await updateUserMe(auth.accessToken);

                handleResponse(response);
              } catch (_error: unknown) {
                setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
                setStatus(RegisterConfirmStatus.rejected);
              }
              break;
            case AuthStateStatus.nonAuthenticated:
              setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
              setStatus(RegisterConfirmStatus.rejected);
              break;
            default:
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
