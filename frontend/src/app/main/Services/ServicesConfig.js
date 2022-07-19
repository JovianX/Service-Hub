import { lazy } from 'react';

const Services = lazy(() => import('./Services'));

const ServicesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'services',
      element: <Services />,
    },
  ],
};

export default ServicesConfig;
