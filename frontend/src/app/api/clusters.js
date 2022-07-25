import axios from 'axios';

const CLUSTERS_API_PATH = '/api/v1/organization';

export const getClusterList = async () => await axios.get(`${CLUSTERS_API_PATH}/kubernetes-configuration`);
