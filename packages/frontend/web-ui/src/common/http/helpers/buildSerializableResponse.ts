import { Response } from '../../../../../../api/libraries/api-http-client/lib/cjs';

export const buildSerializableResponse = (
  response: Response,
): { body: Response; statusCode: number } => {
  return {
    body: response.body,
    statusCode: response.statusCode,
  };
};
