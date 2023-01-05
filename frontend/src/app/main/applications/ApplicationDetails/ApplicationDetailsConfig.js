import { lazy } from 'react';

import { PATHS } from '../../../constants/paths';

const ApplicationDetails = lazy(() => import('./Application'));

const ApplicationDetailsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.APPLICATION_DETAILS,
      element: <ApplicationDetails />,
    },
  ],
};

export default ApplicationDetailsConfig;
