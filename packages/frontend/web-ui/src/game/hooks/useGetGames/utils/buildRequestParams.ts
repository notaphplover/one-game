import { HttpApiParams } from '../../../../common/http/models/HttpApiParams';
import { UseGetGamesContext } from '../models/UseGetGamesContext';
import { UseGetGamesParams } from '../models/UseGetGamesParams';

interface GetGamesHttpQuery {
  [key: string]: string | string[];
  status?: string;
  page?: string;
  pageSize?: string;
}

export function buildRequestParams(
  context: UseGetGamesContext,
  params: UseGetGamesParams,
): HttpApiParams<'getGamesMine'> {
  return [
    {
      authorization: `Bearer ${context.token}`,
    },
    buildQuery(params),
  ];
}

function buildQuery(params: UseGetGamesParams): GetGamesHttpQuery {
  const query: GetGamesHttpQuery = {};

  if (params.page !== undefined) {
    query.page = params.page.toString();
  }

  if (params.pageSize !== undefined) {
    query.pageSize = params.pageSize.toString();
  }

  if (params.status !== undefined) {
    query.status = params.status;
  }

  return query;
}
