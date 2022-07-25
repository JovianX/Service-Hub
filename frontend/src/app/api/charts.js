import axios from 'axios';

const CHART_API_PATH = '/api/v1/helm/chart';

export const getChartList = async () => await axios.get(`${CHART_API_PATH}/list`);