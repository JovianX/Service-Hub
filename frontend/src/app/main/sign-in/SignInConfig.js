import authRoles from '../../auth/authRoles';
import { PATHS } from '../../constants/paths';

import SignInPage from './SignInPage';

const SignInConfig = {
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
      path: PATHS.SIGN_IN,
      element: <SignInPage />,
    },
  ],
};

export default SignInConfig;
