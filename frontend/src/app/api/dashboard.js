import axios from 'axios';

const DASHBOARD_API_PATH = '/api/v1/dashboard/';

export const getReleaseCount = async () => await axios.get(`${DASHBOARD_API_PATH}release-count`);
export const getRepositoryCount = async () => await axios.get(`${DASHBOARD_API_PATH}repository-count`);
export const getChartCount = async () => await axios.get(`${DASHBOARD_API_PATH}chart-count`);
export const getContextCount = async () => await axios.get(`${DASHBOARD_API_PATH}context-count`);
export const getUnhealthyCount = async () => await axios.get(`${DASHBOARD_API_PATH}unhealthy-count`);
export const getServiceCount = async () => await axios.get(`${DASHBOARD_API_PATH}services-count`);
