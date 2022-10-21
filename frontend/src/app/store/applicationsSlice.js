import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getApplicationsList as getApplicationsListAPi,
  deleteApplication as deleteApplicationAPI,
  applicationInstall as applicationInstallAPI,
} from '../api';

export const getApplicationsList = createAsyncThunk('applications/getApplicationsList', async () => {
  try {
    const response = await getApplicationsListAPi();
    const { data } = response;
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
});

export const applicationInstall = createAsyncThunk('applications/applicationInstall', async (application) => {
  try {
    const response = await applicationInstallAPI(application);
    const { data } = response;
    return data;
  } catch (e) {
    if (e?.response.data.message) {
      return {
        status: 'error',
        message: e.response.data.message,
      };
    }
    return {
      status: 'error',
      message: 'Failed to install the application',
    };
  }
});

export const deleteApplication = createAsyncThunk('applications/deleteApplication', async (id) => {
  try {
    await deleteApplicationAPI(id);
    return {
      status: 'success',
      message: 'Application was successfully removed',
    };
  } catch (e) {
    return {
      status: 'error',
      message: e.response.data.message,
    };
  }
});

const applicationsSlice = createSlice({
  name: 'applications/applicationsActions',
  initialState: {
    isLoading: false,
    applications: [],
  },
  reducers: {},
  extraReducers: {
    [getApplicationsList.fulfilled]: (state, { payload }) => ({
      applications: payload,
      isLoading: false,
    }),
    [getApplicationsList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getApplicationsList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [deleteApplication.fulfilled]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [deleteApplication.pending]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [deleteApplication.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectApplications = ({ applications }) => applications.applications;
export const selectIsApplicationsLoading = ({ applications }) => applications.isLoading;

export default applicationsSlice.reducer;
