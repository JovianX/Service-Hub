import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';

import jwtService from './services/jwtService';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const success = async (message) => {
      if (message) {
        dispatch(showMessage({ message }));
      }

      const userData = await jwtService.getUserData();

      Promise.all([
        dispatch(setUser(userData?.data)),
        // You can receive data in here before app initialization
      ]).then(() => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
      });
    };

    const pass = (message) => {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    };

    jwtService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Signing in' }));
      success();
    });

    jwtService.init();

    jwtService.on('onLogin', () => {
      success('Signed in');
    });

    jwtService.on('onLogout', () => {
      pass('Signed out');

      dispatch(logoutUser());
    });

    jwtService.on('onAutoLogout', (message) => {
      pass(message);

      dispatch(logoutUser());
    });

    jwtService.on('onNoAccessToken', () => {
      pass();
    });
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
