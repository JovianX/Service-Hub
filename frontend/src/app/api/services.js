import axios from 'axios';

const SERVICE_API_PATH = '/api/v1/service';

export const getServiceList = async () => await axios.get(`${SERVICE_API_PATH}/list`);
