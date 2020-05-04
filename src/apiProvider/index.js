import axios from 'axios';

const getHeaders = accessToken => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {});

export const getData = async ({
  endpoint, accessToken, logger,
}) => {
  try {
    logger.info(`api called: [GET] ${endpoint}`);
    const response = await axios.get(endpoint, getHeaders(accessToken));
    logger.info(`[GET] ${endpoint} successful`);
    return response.data || null;
  } catch (err) {
    logger.error(`[GET] ${endpoint} ERROR: ${err}`);
    throw err;
  }
};

export const postData = async ({
  endpoint, body = {}, accessToken, logger,
}) => {
  try {
    logger.info(`api called: [POST] ${endpoint}: ${JSON.stringify(body)}`);
    const response = await axios.post(endpoint, body, getHeaders(accessToken));
    logger.info(`[POST] ${endpoint} successful`);
    return response;
  } catch (err) {
    logger.error(`[POST] ${endpoint} ERROR: ${err}`);
    throw err;
  }
};

export const putData = async ({
  endpoint, body = {}, accessToken, logger,
}) => {
  try {
    logger.info(`api called: [PUT] ${endpoint}: ${JSON.stringify(body)}`);
    await axios.put(endpoint, body, getHeaders(accessToken));
    logger.info(`[PUT] ${endpoint} successful`);
    return true;
  } catch (err) {
    logger.error(`[PUT] ${endpoint} ERROR: ${err}`);
    throw err;
  }
};

export const getDocument = async ({
  endpoint, logger,
}) => {
  try {
    logger.info(`api called: [GET] document ${endpoint}`);
    const documentResponse = await axios.get(endpoint, { responseType: 'stream' });
    return documentResponse;
  } catch (err) {
    logger.error(`[GET] document ${endpoint} ERROR: ${err}`);
    throw err;
  }
};
