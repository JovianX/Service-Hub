import axios from 'axios';

const RELEASE_API_PATH = '/api/v1/helm/release';

export const getReleasesList = async () => await axios.get(`${RELEASE_API_PATH}/list`);

export const deleteRelease = async (context_name, namespase, release_name) =>
  await axios.delete(`${RELEASE_API_PATH}/${release_name}`, {
    params: {
      context_name,
      namespase,
    },
  });

export const getReleaseHealth = async (context_name, namespase, release_name) =>
  await axios.get(`${RELEASE_API_PATH}/${release_name}/health-status`, {
    params: {
      context_name,
      namespase,
    },
  });

export const getReleaseTtl = async (context_name, namespase, release_name) =>
  await axios.get(`${RELEASE_API_PATH}/${release_name}/ttl`, {
    params: {
      context_name,
      namespase,
    },
  });

export const createReleaseTtl = async (context_name, namespase, release_name, minutes) => {
  const requestBody = {
    context_name,
    namespase,
  };
  if (minutes > 0) requestBody.minutes = minutes;
  await axios.post(`${RELEASE_API_PATH}/${release_name}/ttl`, requestBody);
};

export const deleteReleaseTtl = async (context_name, namespase, release_name) =>
  await axios.delete(`${RELEASE_API_PATH}/${release_name}/ttl`, {
    params: {
      context_name,
      namespase,
    },
  });

export const getTubValues = async (context_name, namespase, release_name, values_name) =>
  await axios.get(`${RELEASE_API_PATH}/${release_name}/${values_name}`, {
    params: {
      context_name,
      namespase,
    },
  });

export const getHemlReleaseHistory = async ({ context_name, namespase, release_name }) =>
  await axios.get(`${RELEASE_API_PATH}/${release_name}/history`, {
    params: {
      context_name,
      namespase,
    },
  });

export const rollbackRelease = async (release_name, requestBody) =>
  await axios.post(`${RELEASE_API_PATH}/${release_name}/rollback`, requestBody);
