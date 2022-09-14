import { lazy } from 'react';

import { PATHS } from '../../constants/paths';

const Clusters = lazy(() => import('./Clusters'));

const ClustersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.CLUSTERS,
      element: <Clusters />,
    },
  ],
};

export default ClustersConfig;
