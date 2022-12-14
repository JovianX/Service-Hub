import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import axios from 'axios';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';

import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { adminRoutes, operatorRoutes } from 'app/configs/routesConfig';
import settingsConfig from 'app/configs/settingsConfig';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import { selectUser } from 'app/store/userSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';

import AppContext from './AppContext';
import { AuthProvider } from './auth/AuthContext';
import { ABSOLUTE_API_HOST } from './constants/API';
import withAppProviders from './withAppProviders';

axios.defaults.baseURL = ABSOLUTE_API_HOST;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
  rtl: {
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
  ltr: {
    key: 'muiltr',
    stylisPlugins: [],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
};

const App = () => {
  const user = useSelector(selectUser);
  const langDirection = useSelector(selectCurrentLanguageDirection);
  const mainTheme = useSelector(selectMainTheme);

  const getRoutes = () => {
    if (user?.role === 'operator') {
      return operatorRoutes;
    }
    return adminRoutes;
  };

  return (
    <AppContext.Provider value={{ routes: getRoutes() }}>
      <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
        <FuseTheme theme={mainTheme} direction={langDirection}>
          <AuthProvider>
            <BrowserRouter>
              <FuseAuthorization userRole={user.role} loginRedirectUrl={settingsConfig.loginRedirectUrl}>
                <SnackbarProvider
                  maxSnack={5}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  classes={{
                    containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                  }}
                >
                  <FuseLayout layouts={themeLayouts} />
                </SnackbarProvider>
              </FuseAuthorization>
            </BrowserRouter>
          </AuthProvider>
        </FuseTheme>
      </CacheProvider>
    </AppContext.Provider>
  );
};

export default withAppProviders(App)();
