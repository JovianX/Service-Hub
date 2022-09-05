import { lazy } from 'react';

const Users = lazy(() => import('./Users'));

const UsersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'users',
      element: <Users />,
    },
  ],
};

export default UsersConfig;
