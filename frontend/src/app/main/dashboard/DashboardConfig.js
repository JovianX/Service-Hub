import { lazy } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboard',
      element: <Dashboard />,
    },
  ],
};

export default DashboardConfig;
