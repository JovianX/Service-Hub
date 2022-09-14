import { lazy } from 'react';

import { PATHS } from '../../constants/paths';

const Dashboard = lazy(() => import('./Dashboard'));

const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.DASHBOARD,
      element: <Dashboard />,
    },
  ],
};

export default DashboardConfig;
