import axios from 'axios';

const TEMPLATES_API_PATH = '/api/v1/template';

export const getTemplatesList = async () => await axios.get(`${TEMPLATES_API_PATH}/list`);
export const makeTemplateDefault = async (id) => await axios.post(`${TEMPLATES_API_PATH}/${id}/make-default`);
export const createTemplate = async (template) => await axios.post(`${TEMPLATES_API_PATH}/`, template);
export const deleteTemplate = async (id) => await axios.delete(`${TEMPLATES_API_PATH}/${id}`);
export const editTemplate = async (id, template) => await axios.patch(`${TEMPLATES_API_PATH}/${id}`, template);
