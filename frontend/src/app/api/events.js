import axios from 'axios';

const EVENTS_API_PATH = '/api/v1/event/list';

export const getApplicationEventsList = async (category, application_id) =>
  await axios.get(`${EVENTS_API_PATH}/${category}?application_id=${application_id}`);
