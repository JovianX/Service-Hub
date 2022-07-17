import axios from 'axios';

export const getReleasesList = async () => await axios.get('/api/v1/helm/release/list');

export const deleteRelease = async (context_name, namespase, release_name) =>
  await axios.delete('/api/v1/helm/release', {
    params: {
      context_name,
      namespase,
      release_name,
    },
  });
