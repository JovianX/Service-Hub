import axios from 'axios';

const INVITE_API_PATH = '/api/v1/invitation';

export const getInvitationsList = async () => await axios.get(`${INVITE_API_PATH}/list`);
export const addInvitation = async (user) => await axios.post(`${INVITE_API_PATH}/`, user);
export const deleteInvitation = async (id) => await axios.delete(`${INVITE_API_PATH}/${id}`);
export const sendInvitation = async (id) => await axios.post(`${INVITE_API_PATH}/${id}/send-email`);
export const getInvitedUserEmail = async (id) => await axios.get(`${INVITE_API_PATH}/${id}/email`);
