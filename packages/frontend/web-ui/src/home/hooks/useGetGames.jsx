import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { httpClient } from '../../common/http/services/HttpService';

const STATUS_GAME_IDLE = 'idle';
const STATUS_GAME_PENDING = 'pending';
export const STATUS_GAME_FULFILLED = 'fulfilled';
export const STATUS_GAME_REJECTED = 'rejected';

const UNEXPECTED_ERROR_MESSAGE = 'Unexpected error!';

export const useGetGames = (statusGame, page, pageSize) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [gameList, setGameList] = useState({});
  const [numPage, setNumPage] = useState(page);
  const [status, setStatus] = useState(STATUS_GAME_IDLE);
  const { token } = useSelector((state) => state.auth);

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
          } catch (err) {
            setErrorMessage(err);
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

  const pageCounter = (numPage) => {
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