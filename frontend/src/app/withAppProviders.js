// import createGenerateClassName from '@mui/styles/createGenerateClassName';
// import jssPreset from '@mui/styles/jssPreset';
// import { create } from 'jss';
// import jssExtend from 'jss-plugin-extend';
// import rtl from 'jss-rtl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import Provider from 'react-redux/es/components/Provider';

import store from './store';

const withAppProviders = (Component) => (props) => {
  const WrapperComponent = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <Component {...props} />
        </StyledEngineProvider>
      </Provider>
    </LocalizationProvider>
  );

  return WrapperComponent;
};

export default withAppProviders;
