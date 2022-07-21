import { lazy } from 'react';

const Repositories = lazy(() => import('./Repositories'));

const RepositoriesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'repositories',
      element: <Repositories />,
    },
  ],
};

export default RepositoriesConfig;
