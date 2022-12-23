import axios from 'axios';

const EVENTS_API_PATH = '/api/v1/event/list';

export const getEventsList = async (category) => await axios.get(`${EVENTS_API_PATH}/${category}`);
