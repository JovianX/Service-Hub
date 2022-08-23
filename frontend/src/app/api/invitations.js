import axios from 'axios';

const INVITES_API_PATH = 'api/v1/invitation';
const EXPIRATION_PERIOD = 24

export const getInvitationList = async () => await axios.get(`${INVITES_API_PATH}/list`);

export const sendInvite = async (email) =>
  await axios.post(INVITES_API_PATH, {
    data: {
    "email": email,
    "expiration_period": EXPIRATION_PERIOD
  }
});

// export const deleteRepository = async (repository) => await axios.delete(`${INVITES_API_PATH}/${repository}`);
