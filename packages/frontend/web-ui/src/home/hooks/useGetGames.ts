import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { httpClient } from '../../common/http/services/HttpService';

const STATUS_GAME_IDLE: string = 'idle';
const STATUS_GAME_PENDING: string = 'pending';
export const STATUS_GAME_FULFILLED: string = 'fulfilled';
export const STATUS_GAME_REJECTED: string = 'rejected';

const UNEXPECTED_ERROR_MESSAGE: string = 'Unexpected error!';

export const useGetGames = (statusGame: string, page: any, pageSize: any) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gameList, setGameList] = useState({});
  const [numPage, setNumPage] = useState<number>(page);
  const [status, setStatus] = useState<string>(STATUS_GAME_IDLE);
  const { token } = useSelector((state: any) => state.auth);

  let resultGameStatus;

  useEffect(() => {
    void (async () => {
      switch (status) {
        case STATUS_GAME_IDLE:
          setStatus(STATUS_GAME_PENDING);
          break;
        case STATUS_GAME_PENDING:
          try {
            resultGameStatus = await getGamesByStatus();
            setStatus(STATUS_GAME_FULFILLED);
            setGameList(resultGameStatus);
          } catch (err: unknown) {
            setErrorMessage(err as string);
            setStatus(STATUS_GAME_REJECTED);
          }
          break;
      }
    })();
  }, [status, token]);

  const getGamesByStatus = async () => {
    const response = await httpClient.getGamesMine(
      {
        authorization: `Bearer ${token}`,
      },
      {
        status: statusGame,
        page,
        pageSize,
      },
    );

    switch (response.statusCode) {
      case 200:
        return response.body;
      default:
        throw new Error('Unexpected error when fetching user games');
    }
  };

  const pageCounter = (numPage: number) => {
    if (status === STATUS_GAME_FULFILLED) {
      setNumPage(numPage);
      setStatus(STATUS_GAME_IDLE);
    }
  };

  return {
    errorMessage,
    gameList,
    setNumPage: pageCounter,
    numPage,
    status,
  };
};
