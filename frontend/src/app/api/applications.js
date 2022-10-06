import axios from 'axios';

const APPLICATIONS_API_PATH = '/api/v1/application';

export const getApplicationsList = async () => await axios.get(`${APPLICATIONS_API_PATH}/list`);
