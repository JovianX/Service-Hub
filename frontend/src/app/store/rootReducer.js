import { combineReducers } from '@reduxjs/toolkit';

import charts from './chartsSlice';
import clusters from './clustersSlice';
import dashboard from './dashboardSlice';
import fuse from './fuse';
import i18n from './i18nSlice';
import releases from './releasesSlice';
import repositories from './repositorySlice';
import services from './servicesSlice';
import user from './userSlice';
import invites from './invitesSlice';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    user,
    dashboard,
    releases,
    charts,
    services,
    repositories,
    clusters,
    invites,
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
