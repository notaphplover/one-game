import { useSelector } from 'react-redux';
import { httpClient } from '../../common/http/services/HttpService';

export const getGamesByStatus = async (statusGame) => {
  const { token } = useSelector((state) => state.auth);

  const response = await httpClient.getGamesMine(
    {
      authorization: `Bearer ${token}`,
    },
    { status: statusGame },
  );

  switch (response.statusCode) {
    case 200:
      return response.body;
    default:
      throw new Error('Unexpected error when fetching user games');
  }
};
