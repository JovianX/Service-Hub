import authRoles from '../../auth/authRoles';
import { PATHS } from '../../constants/paths';

import SignUpPage from './SignUpPage';

const SignUpConfig = {
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
      path: PATHS.SIGN_UP,
      element: <SignUpPage />,
    },
  ],
};

export default SignUpConfig;
