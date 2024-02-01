export const buildSerializableResponse = (
  response: any,
): { body: any; statusCode: number } => {
  return {
    body: response.body,
    statusCode: response.statusCode,
  };
};
