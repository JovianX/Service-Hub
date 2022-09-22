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
