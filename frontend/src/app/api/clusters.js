import axios from 'axios';

const CLUSTERS_API_PATH = '/api/v1/organization';

export const getClusterList = async () => await axios.get(`${CLUSTERS_API_PATH}/kubernetes-configuration`);

export const deleteContext = async (contextName) =>
  await axios.delete(`${CLUSTERS_API_PATH}/kubernetes-configuration/context`, {
    params: {
      'context-name': contextName,
    },
  });
