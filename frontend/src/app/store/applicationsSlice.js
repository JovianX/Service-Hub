import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getApplicationsList as getApplicationsListAPi,
  deleteApplication as deleteApplicationAPI,
  applicationInstall as applicationInstallAPI,
  createApplicationTtl as createApplicationTtlAPI,
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

export const applicationInstall = createAsyncThunk(
  'applications/applicationInstall',
  async (application, { rejectWithValue }) => {
    try {
      const response = await applicationInstallAPI(application);
      const { data } = response;
      return data;
    } catch (e) {
      if (e?.response.data.message) {
        return rejectWithValue({
          status: 'error',
          message: e.response.data.message,
        });
      }
      return rejectWithValue({
        status: 'error',
        message: 'Failed to install the application',
      });
    }
  },
);

export const deleteApplication = createAsyncThunk('applications/deleteApplication', async (id) => {
  try {
    await deleteApplicationAPI(id);
    return {
      id,
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

export const setApplicationTtl = createAsyncThunk('applications/createApplicationTtl', async ({ id, hours }) => {
  try {
    await createApplicationTtlAPI(id, hours);
    return {
      status: 'success',
      message: hours.hours === 0 ? 'Unset ttl was successful' : 'Setting ttl was successful',
    };
  } catch (e) {
    return {
      status: 'error',
      message: 'An error occurred when adding ttl',
    };
  }
});

const applicationsSlice = createSlice({
  name: 'applications/applicationsActions',
  initialState: {
    isLoading: false,
    applications: [],
    isFirstRequest: true,
  },
  reducers: {
    setIsFirstApplicationsRequest(state) {
      state.isFirstRequest = false;
    },
  },
  extraReducers: {
    [getApplicationsList.fulfilled]: (state, { payload }) => ({
      ...state,
      applications: payload,
      isLoading: false,
    }),
    [getApplicationsList.pending]: (state) => ({
      ...state,
      isLoading: state.isFirstRequest,
    }),
    [getApplicationsList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [applicationInstall.fulfilled]: (state, { payload }) => {
      state.applications = [...state.applications, payload.application];
    },
    [deleteApplication.fulfilled]: (state, { payload }) => {
      state.applications = [...state.applications.filter((item) => item.id !== payload.id)];
      state.isLoading = false;
    },
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

export const { setIsFirstApplicationsRequest } = applicationsSlice.actions;
export default applicationsSlice.reducer;
