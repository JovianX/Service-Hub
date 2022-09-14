import axios from 'axios';

const USERS_API_PATH = '/api/v1/user';

export const getUsersList = async () => await axios.get(`${USERS_API_PATH}/list`);
export const activateUser = async (id) => await axios.post(`${USERS_API_PATH}/${id}/activate`);
export const deactivateUser = async (id) => await axios.post(`${USERS_API_PATH}/${id}/deactivate`);
export const deleteUser = async (id) => await axios.delete(`${USERS_API_PATH}/${id}`);

