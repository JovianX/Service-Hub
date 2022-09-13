import axios from 'axios';

const REPOSITORY_API_PATH = '/api/v1/helm/repository';

export const getRepositoryList = async () => await axios.get(`${REPOSITORY_API_PATH}/list`);
export const createRepository = async (repository) => await axios.post(`${REPOSITORY_API_PATH}/add`, repository);
export const deleteRepository = async (repository) => await axios.delete(`${REPOSITORY_API_PATH}/${repository}`);
