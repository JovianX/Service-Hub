import axios from 'axios';
import jwtDecode from 'jwt-decode';

import FuseUtils from '@fuse/utils/FuseUtils';

import jwtServiceConfig from './jwtServiceConfig';

/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise(() => {
          if (err?.response?.status === 401 && err?.config && !err?.config?.__isRetryRequest) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token');
            this.setSession(null);
          }
          throw err;
        });
      },
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit('onNoAccessToken');

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);

      this.emit('onAutoLogin', true);
    } else {
      this.setSession(null);
      this.emit('onAutoLogout', 'access_token expired');
    }
  };

  createUser = async (data) => {
    await axios.post(jwtServiceConfig.signUp, data);
  };

  getUserData = async () => {
    return await axios.get(jwtServiceConfig.userMe);
  };

  signInWithEmailAndPassword = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await axios.post(jwtServiceConfig.signIn, formData);

    if (response?.data?.access_token) {
      this.setSession(response.data.access_token);

      this.emit('onLogin');
    } else {
      throw new Error(response.data.error);
    }
  };

  signInWithGithub = async () => {
    const response = await axios.get(jwtServiceConfig.signInWithGithub);
    if (response?.data?.authorization_url) {
      return response?.data?.authorization_url;
    }
    throw new Error(response.data.error);
  };

  getTokenWithGithubCode = async (params) => {
    const response = await axios.get(jwtServiceConfig.getTokenWithGithubCode, {
      params,
    });
    if (response?.data?.access_token) {
      this.setSession(response.data.access_token);
      this.emit('onLogin');
      localStorage.removeItem('inviteId');
    } else {
      throw new Error(response.data.error);
    }
  };

  updateUserData = (user) => {
    return axios.post(jwtServiceConfig.updateUser, { user });
  };

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem('jwt_access_token', access_token);
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      localStorage.removeItem('jwt_access_token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  logout = () => {
    this.setSession(null);
    this.emit('onLogout', 'Logged out');
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    const decoded = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('access token expired');
      return false;
    }

    return true;
  };

  getAccessToken = () => {
    return localStorage.getItem('jwt_access_token');
  };
}

const instance = new JwtService();

export default instance;
