import axios from 'axios';

const ACCESS_TOKENS_API_PATH = '/api/v1/access-token';

export const getAccessTokensList = async () => await axios.get(`${ACCESS_TOKENS_API_PATH}/list`);

export const changeAccessTokenStatus = async (token, status) =>
  await axios.post(`${ACCESS_TOKENS_API_PATH}/${token}/status`, status);

export const deleteAccessToken = async (token) => await axios.delete(`${ACCESS_TOKENS_API_PATH}/${token}`);
