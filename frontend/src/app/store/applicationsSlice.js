import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getApplicationsList as getApplicationsListAPi, deleteApplication as deleteApplicationAPI } from '../api';

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
    const response = await applicationInstall(application);
    const { data } = response;
    return data;
  } catch (e) {
    return e.response.data;
  }
});

export const deleteApplication = createAsyncThunk('applications/deleteApplication', async (id) => {
  try {
    await deleteApplicationAPI(id);
    return {
      status: 'success',
      text: 'Application was successfully removed',
    };
  } catch (e) {
    return {
      status: 'error',
      text: e.response.data.message,
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
