import { lazy } from 'react';

import { PATHS } from '../../constants/paths';

const Charts = lazy(() => import('./Charts'));

const ChartsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.CHARTS,
      element: <Charts />,
    },
  ],
};

export default ChartsConfig;
