import { combineReducers } from '@reduxjs/toolkit';

import charts from './chartsSlice';
import dashboard from './dashboardSlice';
import fuse from './fuse';
import i18n from './i18nSlice';
import releases from './releasesSlice';
import user from './userSlice';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    user,
    dashboard,
    releases,
    charts,
    ...asyncReducers,
  });

  /*
	Reset the redux store when user logged out
	 */
  if (action.type === 'user/userLoggedOut') {
    // state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
