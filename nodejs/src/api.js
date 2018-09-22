const apiConstants = {
  RESPONSE: 'response',
  ERROR: 'error',
  ERRNO: 'errno',
  ERROR_REQUEST: 'Error in the server request',
  ERROR_PARAMS: 'Один из необходимых параметров был не передан или неверен', // TODO: перевести
  ERROR_FILE: 'No file'
}

const createDefaultJson = () => {
  const resObject = {}
  resObject[apiConstants.RESPONSE] = {}
  return resObject
}

module.exports = {
  createDefaultJson,
  apiConstants
}
