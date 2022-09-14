import { lazy } from 'react';

import { PATHS } from '../../constants/paths';

const Releases = lazy(() => import('./Releases'));

const ReleasesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.RELEASES,
      element: <Releases />,
    },
  ],
};

export default ReleasesConfig;
