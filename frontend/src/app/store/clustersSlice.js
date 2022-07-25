import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getClusterList as getClusterListAPI } from '../api';

export const getClustersList = createAsyncThunk('clusters/getClustersList', async () => {
  try {
    const response = await getClusterListAPI();

    const data = await response.data;

    return data;
  } catch (e) {
    return [];
  }
});

const clustersSlice = createSlice({
  name: 'clusters/clustersList',
  initialState: {
    isLoading: false,
    clusters: [],
  },
  reducers: {},
  extraReducers: {
    [getClustersList.fulfilled]: (state, { payload }) => ({
      clusters: payload,
      isLoading: false,
    }),
    [getClustersList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getClustersList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectClusters = ({ clusters }) => clusters.clusters;
export const selectIsClustersLoading = ({ clusters }) => clusters.isLoading;

export default clustersSlice.reducer;
