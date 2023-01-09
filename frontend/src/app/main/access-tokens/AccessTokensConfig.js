import { lazy } from 'react';

import { PATHS } from '../../constants/paths';

const AccessTokens = lazy(() => import('./AccessTokens'));

const AccessTokensConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.ACCESS_TOKENS,
      element: <AccessTokens />,
    },
  ],
};

export default AccessTokensConfig;
