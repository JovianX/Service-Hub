import { ABSOLUTE_API_HOST } from './API';

const jwtAccessToken = localStorage.getItem('jwt_access_token');
export const kubeconfigUrl = `curl -s https://kubeconfig.jovianx.app/install | bash -s -- --jwt-token ${jwtAccessToken} --jovianx-url ${ABSOLUTE_API_HOST}`;
