import { models as apiModels } from '@cornie-js/api-models';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { httpClient } from '../../common/http/services/HttpService';
import { Either, Left, Right } from '../../common/models/Either';
import { UseGetGamesState } from '../models/UseGetGamesState';
import {
  UseGetGamesParams,
  UseGetGamesResult,
} from '../models/UseGetGamesResult';

export const STATUS_GAME_FULFILLED: string = 'fulfilled';
export const STATUS_GAME_REJECTED: string = 'rejected';

export const UNEXPECTED_ERROR_MESSAGE: string =
  'Unexpected error when fetching user games';

interface GetGamesHttpQuery {
  [key: string]: string | string[];
  status?: string;
  page?: string;
  pageSize?: string;
}

export const useGetGames = (pageSize: number): UseGetGamesResult => {
  const [result, setResult] = useState<Either<
    string,
    apiModels.GameArrayV1
  > | null>(null);
  const [params, setParams] = useState<UseGetGamesParams | null>(null);
  const [status, setStatus] = useState<UseGetGamesState>(UseGetGamesState.idle);
  const { token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    void (async () => {
      switch (status) {
        case UseGetGamesState.pending:
          try {
            const gamesResult: apiModels.GameArrayV1 = await getGames();
            const resultOk: Right<apiModels.GameArrayV1> = {
              isRight: true,
              value: gamesResult,
            };
            setResult(resultOk);
          } catch (err: unknown) {
            const isResultKo: Left<string> = {
              isRight: false,
              value: UNEXPECTED_ERROR_MESSAGE,
            };
            setResult(isResultKo);
          } finally {
            setStatus(UseGetGamesState.idle);
          }
          break;
      }
    })();
  }, [status, token]);

  const buildHttpQuery = (
    params: UseGetGamesParams | null,
  ): GetGamesHttpQuery => {
    if (params === null) {
      throw new Error('Unexpected missing params');
    }

    const httpParams: {
      status?: string;
      page?: string;
      pageSize?: string;
    } = {
      page: params.pageNumber.toString(),
      pageSize: pageSize.toString(),
    };

    if (params.status !== null) {
      httpParams.status = params.status;
    }

    return httpParams;
  };

  const getGames = async () => {
    const response = await httpClient.getGamesMine(
      {
        authorization: `Bearer ${token}`,
      },
      buildHttpQuery(params),
    );

    switch (response.statusCode) {
      case 200:
        return response.body;
      default:
        throw new Error(UNEXPECTED_ERROR_MESSAGE);
    }
  };

  const call = (params: UseGetGamesParams): void => {
    if (status === UseGetGamesState.idle) {
      setParams(params);
      setStatus(UseGetGamesState.pending);
    }
  };

  return {
    call,
    result,
  };
};
