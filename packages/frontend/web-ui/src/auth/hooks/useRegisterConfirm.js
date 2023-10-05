import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { httpClient } from '../../common/http/services/HttpService';
import { buildSerializableResponse } from '../../common/http/helpers/buildSerializableResponse';
import { createAuthByToken } from '../../app/store/thunk/createAuthByToken';

const CODE_QUERY_PARAM = 'code';
export const STATUS_FULFILLED = 'fulfilled';
export const STATUS_IDLE = 'idle';
export const STATUS_PENDING = 'pending';
export const STATUS_REJECTED = 'rejected';

const UNEXPECTED_ERROR_MESSAGE = 'Unexpected error!';

export const useRegisterConfirm = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [status, setStatus] = useState(STATUS_IDLE);

  const url = new URL(window.location.href);
  const codeParam = url.searchParams.get(CODE_QUERY_PARAM);

  const dispatch = useDispatch();
  const { token, errorMessage: authErrorMessage } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    void (async () => {
      switch (status) {
        case STATUS_IDLE:
          setStatus(STATUS_PENDING);

          if (codeParam === null) {
            setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
            setStatus(STATUS_REJECTED);
          } else {
            await dispatch(createAuthByToken(codeParam));
          }
          break;
        case STATUS_PENDING:
          if (token !== null) {
            try {
              await updateUserMe(token);
              setStatus(STATUS_FULFILLED);
            } catch (_) {
              setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
              setStatus(STATUS_REJECTED);
            }
          }

          if (authErrorMessage !== null) {
            setErrorMessage(authErrorMessage);
            setStatus(STATUS_REJECTED);
          }
          break;
      }
    })();
  }, [token, status, authErrorMessage]);

  const updateUserMe = async (token) => {
    const response = await httpClient.updateUserMe(
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
