import authRoles from '../../auth/authRoles';
import { PATHS } from '../../constants/paths';

import ResetPasswordPage from './ResetPasswordPage';

const ResetPasswordConfig = {
  settings: {
    layout: {
      config: {
        navbar: { display: false },
        toolbar: { display: false },
        footer: { display: false },
        leftSidePanel: { display: false },
        rightSidePanel: { display: false },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: PATHS.RESET_PASSWORD,
      element: <ResetPasswordPage />,
    },
  ],
};

export default ResetPasswordConfig;
