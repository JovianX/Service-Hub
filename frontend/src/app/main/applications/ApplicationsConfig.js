import { lazy } from 'react';

import { PATHS } from '../../constants/paths';

const Applications = lazy(() => import('./Applications'));

const ApplicationsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.APPLICATIONS,
      element: <Applications />,
    },
  ],
};

export default ApplicationsConfig;
