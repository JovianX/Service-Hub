import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import _ from '@lodash';

import { getClusterList as getClusterListAPI, deleteContext as deleteContextAPI } from '../api';

export const getClustersList = createAsyncThunk('clusters/getClustersList', async () => {
  try {
    const response = await getClusterListAPI();

    const data = await response.data;

    if (data) {
      const clusters = data?.clusters;

      _.forEach(clusters, (cluster) => {
        const context = _.find(data?.contexts, ['cluster', cluster.name]);

        if (context) {
          cluster.contextName = context.name;
        }
      });

      return {
        clusters,
        defaultContext: data?.current_context || null,
      };
    }

    return {
      clusters: [],
      defaultContext: null,
    };
  } catch (e) {
    return {
      clusters: [],
      defaultContext: null,
    };
  }
});

export const deleteContext = createAsyncThunk('clusters/deleteContext', async (contextName) => {
  try {
    await deleteContextAPI(contextName);
  } catch (e) {
    // handle error state
  }
});

const clustersSlice = createSlice({
  name: 'clusters/clustersList',
  initialState: {
    isLoading: false,
    clusters: [],
    defaultContext: null,
  },
  reducers: {},
  extraReducers: {
    [getClustersList.fulfilled]: (state, { payload }) => ({
      clusters: payload.clusters,
      defaultContext: payload.defaultContext,
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
export const selectDefaultContext = ({ clusters }) => clusters.defaultContext;

export default clustersSlice.reducer;
