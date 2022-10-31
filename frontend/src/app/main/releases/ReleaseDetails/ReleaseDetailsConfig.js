import { lazy } from 'react';

import { PATHS } from '../../../constants/paths';

const ReleaseDetails = lazy(() => import('./ReleaseDetails'));

const ReleasesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.RELEASE_DETAILS,
      element: <ReleaseDetails />,
    },
  ],
};

export default ReleasesConfig;
