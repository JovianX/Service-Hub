import axios from 'axios';

const USERS_API_PATH = '/api/v1/invitation';

export const getInvitationsList = async () => await axios.get(`${USERS_API_PATH}/list`);
export const addInvitation = async (user) => await axios.post(`${USERS_API_PATH}/`, user);
export const deleteInvitation = async (id) => await axios.delete(`${USERS_API_PATH}/${id}`);
export const sendInvitation = async (id) => await axios.post(`${USERS_API_PATH}/${id}/send-email`);
