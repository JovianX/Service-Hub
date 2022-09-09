import axios from 'axios';

const CHART_API_PATH = '/api/v1/helm/chart';
const KUBERNETES_API_NAMESPACE = '/api/v1/kubernetes/namespace';

const config = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const getChartList = async () => await axios.get(`${CHART_API_PATH}/list`);
export const chartInstall = async (chart) => await axios.post(`${CHART_API_PATH}/install`, chart, config);
export const getNamespacesList = async (param) =>
  await axios.get(`${KUBERNETES_API_NAMESPACE}/list?context_name=${param}`);
