import axios from 'axios';

const KUBERNETES_API_PATH = '/api/v1/dashboard/';

export const getNamespaceList = async () => await axios.get(`${KUBERNETES_API_PATH}/namespace/list`);

export const getIngressList = async () => await axios.get(`${KUBERNETES_API_PATH}/ingress/list`);

export const getKubernetesServiceList = async () => await axios.get(`${KUBERNETES_API_PATH}/service/list`);
