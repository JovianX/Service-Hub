import authRoles from '../../auth/authRoles';
import { PATHS } from '../../constants/paths';

import ForgotPasswordPage from './ForgotPasswordPage';

const ForgotPasswordConfig = {
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
      path: PATHS.FORGOT_PASSWORD,
      element: <ForgotPasswordPage />,
    },
  ],
};

export default ForgotPasswordConfig;
