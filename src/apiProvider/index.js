import axios from 'axios';

const getHeaders = accessToken => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {});

export const getData = async ({
  endpoint, accessToken, logger,
}) => {
  logger.info(`api called: [GET] ${endpoint}`);

  const response = await axios.get(endpoint, getHeaders(accessToken));
  return response.data || null;
};

export const postData = async ({
  endpoint, body = {}, accessToken, logger,
}) => {
  logger.info(`api called: [POST] ${endpoint}: ${JSON.stringify(body)}`);

  return axios.post(endpoint, body, getHeaders(accessToken));
};

export const putData = async ({
  endpoint, body = {}, accessToken, logger,
}) => {
  logger.info(`api called: [PUT] ${endpoint}: ${JSON.stringify(body)}`);

  await axios.put(endpoint, body, getHeaders(accessToken));
  return true;
};
