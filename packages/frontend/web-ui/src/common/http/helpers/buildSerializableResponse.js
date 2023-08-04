
export const buildSerializableResponse = ( response ) => {
  
    return ({
        body: response.body,
        statusCode: response.statusCode,
    })
}
