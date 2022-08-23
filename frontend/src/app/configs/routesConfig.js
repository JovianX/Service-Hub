import { Navigate } from 'react-router-dom';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';
import settingsConfig from 'app/configs/settingsConfig';

import Error404Page from '../main/404/Error404Page';
import ChartsConfig from '../main/charts/ChartsConfig';
import ClustersConfig from '../main/clusters/ClustersConfig';
import DashboardConfig from '../main/dashboard/DashboardConfig';
import ExampleConfig from '../main/example/ExampleConfig';
import ReleasesConfig from '../main/releases/ReleasesConfig';
import RepositoriesConfig from '../main/repositories/RepositoriesConfig';
import ServicesConfig from '../main/services/ServicesConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import InvitesConfig from '../main/invitations/InvitesConfig';


const routeConfigs = [
  ClustersConfig,
  RepositoriesConfig,
  ServicesConfig,
  ChartsConfig,
  ReleasesConfig,
  DashboardConfig,
  ExampleConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  InvitesConfig
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
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

export default routes;
