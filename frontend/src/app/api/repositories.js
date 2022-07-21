import axios from 'axios';

const REPOSITORY_API_PATH = '/api/v1/helm/repository';

export const getRepositoryList = async () => await axios.get(`${REPOSITORY_API_PATH}/list`);
