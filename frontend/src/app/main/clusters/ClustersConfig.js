import { lazy } from 'react';

const Clusters = lazy(() => import('./Clusters'));

const ClustersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'clusters',
      element: <Clusters />,
    },
  ],
};

export default ClustersConfig;
