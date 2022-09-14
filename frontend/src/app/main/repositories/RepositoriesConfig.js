import { lazy } from 'react';

import { PATHS } from '../../constants/paths';

const Repositories = lazy(() => import('./Repositories'));

const RepositoriesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.REPOSITORIES,
      element: <Repositories />,
    },
  ],
};

export default RepositoriesConfig;
