import axios from 'axios';

const TEMPLATES_API_PATH = '/api/v1/template';

export const getTemplatesList = async () => await axios.get(`${TEMPLATES_API_PATH}/list`);
export const makeTemplateDefault = async (id) => await axios.post(`${TEMPLATES_API_PATH}/${id}/make-default`);
