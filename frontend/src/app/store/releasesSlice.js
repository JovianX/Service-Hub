import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getReleasesList, deleteRelease as deleteReleaseAPI, getReleaseHealth as getReleaseHealthAPI } from '../api';

export const getReleases = createAsyncThunk('releases/getReleasesList', async () => {
  try {
    const response = await getReleasesList();
    const listData = await response.data;
    const health_statuses = [];
    if (listData.length) {
      for (const el of listData) {
        const response = await getReleaseHealthAPI(el.namespace, el.context_name, el.name);
        health_statuses.push({ ...el, health_status: response.data.status });
      }
    }
    return health_statuses;
  } catch (e) {
    return [];
  }
});

export const deleteRelease = createAsyncThunk('releases/deleteRelease', async ({ context_name, namespace, name }) => {
  try {
    await deleteReleaseAPI(context_name, namespace, name);
  } catch (e) {
    // handle error state
  }
});

const releasesSlice = createSlice({
  name: 'releases/releasesList',
  initialState: {
    isLoading: false,
    releases: [],
  },
  reducers: {},
  extraReducers: {
    [getReleases.fulfilled]: (state, { payload }) => ({
      releases: payload,
      isLoading: false,
    }),
    [getReleases.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getReleases.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
    // [getReleaseHealth.fulfilled]: (state) => ({
    //   ...state,
    //   isLoading: false,
    // }),
    // [getReleaseHealth.pending]: (state) => ({
    //   ...state,
    //   isLoading: true,
    // }),
  },
});

export const selectReleases = ({ releases }) => releases.releases;
export const selectIsReleasesLoading = ({ releases }) => releases.isLoading;

export default releasesSlice.reducer;
