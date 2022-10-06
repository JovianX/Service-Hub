import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getApplicationsList as getApplicationsListAPi } from '../api';

export const getApplicationsList = createAsyncThunk('invitations/getApplicationsList', async () => {
  try {
    const response = await getApplicationsListAPi();
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
    return [];
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
  },
});

export const selectApplications = ({ applications }) => applications.applications;
export const selectIsApplicationsLoading = ({ applications }) => applications.isLoading;

export default applicationsSlice.reducer;
