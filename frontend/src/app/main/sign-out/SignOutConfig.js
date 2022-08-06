import { PATHS } from '../../constants/paths';

import SignOutPage from './SignOutPage';

const SignOutConfig = {
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
  auth: null,
  routes: [
    {
      path: PATHS.SIGN_OUT,
      element: <SignOutPage />,
    },
  ],
};

export default SignOutConfig;
