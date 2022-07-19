import { lazy } from 'react';

const Charts = lazy(() => import('./Charts'));

const ChartsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'charts',
      element: <Charts />,
    },
  ],
};

export default ChartsConfig;
