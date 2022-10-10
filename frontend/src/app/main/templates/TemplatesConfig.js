import { lazy } from 'react';

import { PATHS } from '../../constants/paths';

const Templates = lazy(() => import('./Templates'));

const TemplatesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.TEMPLATES,
      element: <Templates />,
    },
  ],
};

export default TemplatesConfig;
