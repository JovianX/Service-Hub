import axios from 'axios';

export const getReleasesList = async () => await axios.get('/api/v1/helm/release/list');

export const deleteRelease = async (context_name, namespase, release_name) =>
  await axios.delete(`/api/v1/helm/release/${release_name}`, {
    params: {
      context_name,
      namespase,
    },
  });

export const getReleaseHealth = async (context_name, namespase, release_name) =>
  await axios.get(`/api/v1/helm/release/${release_name}/health-status`, {
    params: {
      context_name,
      namespase,
    },
  });

export const getReleaseTtl = async (context_name, namespase, release_name) =>
  await axios.get(`/api/v1/helm/release/${release_name}/ttl`, {
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
  await axios.post(`/api/v1/helm/release/${release_name}/ttl`, requestBody);
};

export const deleteReleaseTtl = async (context_name, namespase, release_name) =>
  await axios.delete(`/api/v1/helm/release/${release_name}/ttl`, {
    params: {
      context_name,
      namespase,
    },
  });

export const getTubValues = async (context_name, namespase, release_name, values_name) =>
  await axios.get(`/api/v1/helm/release/${release_name}/${values_name}`, {
    params: {
      context_name,
      namespase,
    },
  });

export const getHemlReleaseHistory = async (context_name, namespase, release_name) =>
  await axios.get(`/api/v1/helm/release/${release_name}/history`, {
    params: {
      context_name,
      namespase,
    },
  });
