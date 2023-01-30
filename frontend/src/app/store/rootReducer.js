import { combineReducers } from '@reduxjs/toolkit';

import { generalSettingsAPI } from 'app/store/generalSettingSlice';

import accessTokens from './accessTokensSlice';
import applications from './applicationsSlice';
import charts from './chartsSlice';
import clusters from './clustersSlice';
import dashboard from './dashboardSlice';
import fuse from './fuse';
import i18n from './i18nSlice';
import invitations from './invitationsSlice';
import release from './releaseSlice';
import releases from './releasesSlice';
import repositories from './repositorySlice';
import services from './servicesSlice';
import templates from './templatesSlice';
import user from './userSlice';
import users from './usersSlice';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    user,
    invitations,
    users,
    templates,
    applications,
    dashboard,
    release,
    releases,
    charts,
    services,
    repositories,
    clusters,
    accessTokens,
    [generalSettingsAPI.reducerPath]: generalSettingsAPI.reducer,
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
