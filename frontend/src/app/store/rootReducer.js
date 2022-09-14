import { combineReducers } from '@reduxjs/toolkit';

import charts from './chartsSlice';
import clusters from './clustersSlice';
import dashboard from './dashboardSlice';
import fuse from './fuse';
import i18n from './i18nSlice';
import invitations from './invitationsSlice';
import releases from './releasesSlice';
import repositories from './repositorySlice';
import services from './servicesSlice';
import user from './userSlice';
import users from './usersSlice';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    user,
    invitations,
    users,
    dashboard,
    releases,
    charts,
    services,
    repositories,
    clusters,
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
