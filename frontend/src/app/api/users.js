import axios from 'axios';

const USERS_API_PATH = '/api/v1/invitation';

export const getUsersList = async () => await axios.get(`${USERS_API_PATH}/list`);
export const addUser = async (user) => await axios.post(`${USERS_API_PATH}/`, user);
export const deleteUser = async (id) => await axios.delete(`${USERS_API_PATH}/${id}`);
export const sendInvite = async (id) => await axios.post(`${USERS_API_PATH}/${id}/send-email`);
