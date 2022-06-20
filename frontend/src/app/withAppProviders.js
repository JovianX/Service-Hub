// import createGenerateClassName from '@mui/styles/createGenerateClassName';
// import jssPreset from '@mui/styles/jssPreset';
// import { create } from 'jss';
// import jssExtend from 'jss-plugin-extend';
// import rtl from 'jss-rtl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import Provider from 'react-redux/es/components/Provider';

import routes from 'app/configs/routesConfig';

import AppContext from './AppContext';
import store from './store';

const withAppProviders = (Component) => (props) => {
  const WrapperComponent = () => (
    <AppContext.Provider value={{ routes }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <StyledEngineProvider injectFirst>
            <Component {...props} />
          </StyledEngineProvider>
        </Provider>
      </LocalizationProvider>
    </AppContext.Provider>
  );

  return WrapperComponent;
};

export default withAppProviders;
