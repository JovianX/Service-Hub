import { Navigate } from 'react-router-dom';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';
import settingsConfig from 'app/configs/settingsConfig';

import Error404Page from '../main/404/Error404Page';
import AccessTokensConfig from '../main/access-tokens/AccessTokensConfig';
import ApplicationDetailsConfig from '../main/applications/ApplicationDetails/ApplicationDetailsConfig';
import ApplicationsConfig from '../main/applications/ApplicationsConfig';
import ChartsConfig from '../main/charts/ChartsConfig';
import ClustersConfig from '../main/clusters/ClustersConfig';
import DashboardConfig from '../main/dashboard/DashboardConfig';
import ExampleConfig from '../main/example/ExampleConfig';
import ForgotPasswordConfig from '../main/forgot-password/ForgotPasswordConfig';
import GeneralSettingsConfig from '../main/general-settings/GeneralSettingsLConfig';
import ReleaseDetailsConfig from '../main/releases/ReleaseDetails/ReleaseDetailsConfig';
import ReleasesConfig from '../main/releases/ReleasesConfig';
import RepositoriesConfig from '../main/repositories/RepositoriesConfig';
import ResetPasswordConfig from '../main/reset-password/ResetPasswordConfig';
import ServicesConfig from '../main/services/ServicesConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import TemplatesConfig from '../main/templates/TemplatesConfig';
import UsersConfig from '../main/users/UsersConfig';

const adminRouteConfigs = [
  SignInConfig,
  SignUpConfig,
  SignOutConfig,
  ForgotPasswordConfig,
  ResetPasswordConfig,
  ClustersConfig,
  RepositoriesConfig,
  ServicesConfig,
  ChartsConfig,
  ApplicationsConfig,
  ApplicationDetailsConfig,
  ReleasesConfig,
  ReleaseDetailsConfig,
  DashboardConfig,
  ExampleConfig,
  UsersConfig,
  TemplatesConfig,
  AccessTokensConfig,
  GeneralSettingsConfig,
];
const operatorRouteConfigs = [
  SignInConfig,
  SignUpConfig,
  SignOutConfig,
  ForgotPasswordConfig,
  ResetPasswordConfig,
  ApplicationsConfig,
  ApplicationDetailsConfig,
  ChartsConfig,
  RepositoriesConfig,
  ReleasesConfig,
  ReleaseDetailsConfig,
  DashboardConfig,
  TemplatesConfig,
  AccessTokensConfig,
  GeneralSettingsConfig,
];

const adminRoutes = [
  ...FuseUtils.generateRoutesFromConfigs(adminRouteConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to='/dashboard' />,
    // auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to='404' />,
  },
];

const operatorRoutes = [
  ...FuseUtils.generateRoutesFromConfigs(operatorRouteConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to='/dashboard' />,
    // auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to='404' />,
  },
];

export { adminRoutes, operatorRoutes };
