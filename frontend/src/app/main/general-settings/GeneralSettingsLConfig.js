import { lazy } from 'react';

import { PATHS } from '../../constants/paths';

const GeneralSettings = lazy(() => import('./GeneralSettings'));

const GeneralSettingsLConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: PATHS.GENERAL_SETTINGS,
      element: <GeneralSettings />,
    },
  ],
};

export default GeneralSettingsLConfig;
