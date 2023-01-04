import axios from 'axios';

const ACCESS_TOKENS_API_PATH = '/api/v1/access-token';

export const getAccessTokensList = async () => await axios.get(`${ACCESS_TOKENS_API_PATH}/list`);
