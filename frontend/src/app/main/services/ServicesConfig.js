import { lazy } from 'react';

import { PATHS } from '../../constants/paths';

const Services = lazy(() => import('./Services'));
const ServiceCreate = lazy(() => import('./ServiceCreate'));

const ServicesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.SERVICES,
      element: <Services />,
    },
    {
      path: PATHS.SERVICE_CREATE,
      element: <ServiceCreate />,
    },
  ],
};

export default ServicesConfig;
