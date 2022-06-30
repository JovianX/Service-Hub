import { lazy } from 'react';

const Releases = lazy(() => import('./Releases'));

const ReleasesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'releases',
      element: <Releases />,
    },
  ],
};

export default ReleasesConfig;
