import { lazy } from 'react';

const Invites = lazy(() => import('./Invites'));

const InvitesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'invitations',
      element: <Invites />,
    },
  ],
};

export default InvitesConfig;
