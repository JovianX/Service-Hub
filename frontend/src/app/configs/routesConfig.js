import { Navigate } from 'react-router-dom';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';
import settingsConfig from 'app/configs/settingsConfig';

import Error404Page from '../main/404/Error404Page';
import ApplicationsConfig from '../main/applications/ApplicationsConfig';
import ChartsConfig from '../main/charts/ChartsConfig';
import ClustersConfig from '../main/clusters/ClustersConfig';
import DashboardConfig from '../main/dashboard/DashboardConfig';
import ExampleConfig from '../main/example/ExampleConfig';
import ForgotPasswordConfig from '../main/forgot-password/ForgotPasswordConfig';
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

const initialRouteConfigs = [SignInConfig, SignUpConfig, SignOutConfig, ForgotPasswordConfig, ResetPasswordConfig];

const adminRouteConfigs = [
  SignOutConfig,
  SignInConfig,
  ClustersConfig,
  RepositoriesConfig,
  ServicesConfig,
  ChartsConfig,
  ApplicationsConfig,
  ReleasesConfig,
  ReleaseDetailsConfig,
  DashboardConfig,
  ExampleConfig,
  UsersConfig,
  TemplatesConfig,
];
const operatorRouteConfigs = [
  SignOutConfig,
  SignInConfig,
  ApplicationsConfig,
  ChartsConfig,
  RepositoriesConfig,
  ReleasesConfig,
  ReleaseDetailsConfig,
  DashboardConfig,
];

const initialRoutes = [
  ...FuseUtils.generateRoutesFromConfigs(initialRouteConfigs, settingsConfig.defaultAuth),
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

export { initialRoutes, adminRoutes, operatorRoutes };
