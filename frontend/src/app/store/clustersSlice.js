import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import _ from '@lodash';

import {
  getClusterList as getClusterListAPI,
  deleteContext as deleteContextAPI,
  uploadConfiguration as uploadConfigurationAPI,
} from '../api';

export const getContextList = createAsyncThunk('clusters/getContextList', async () => {
  try {
    const response = await getClusterListAPI();

    const data = await response.data;

    if (data) {
      const contexts = data?.contexts;

      _.forEach(contexts, (context) => {
        const cluster = _.find(data?.clusters, ['name', context.cluster]);

        if (cluster) {
          context.cloud_provider = cluster.cloud_provider;
          context.region = cluster.region;
        }
      });

      return {
        contexts,
        defaultContext: data?.current_context || null,
      };
    }

    return {
      contexts: [],
      defaultContext: null,
    };
  } catch (e) {
    return {
      contexts: [],
      defaultContext: null,
    };
  }
});

export const uploadConfiguration = createAsyncThunk('clusters/uploadConfiguration', async (configuration) => {
  try {
    const response = await uploadConfigurationAPI(configuration);
    const { data } = response;
    return data;
  } catch (e) {
    return e.response.data;
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
    contexts: [],
    defaultContext: null,
  },
  reducers: {},
  extraReducers: {
    [getContextList.fulfilled]: (state, { payload }) => ({
      contexts: payload.contexts,
      defaultContext: payload.defaultContext,
      isLoading: false,
    }),
    [getContextList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getContextList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [uploadConfiguration.fulfilled]: (state) => ({
      ...state,
    }),
  },
});

export const selectContexts = ({ clusters }) => clusters.contexts;
export const selectIsContextsLoading = ({ clusters }) => clusters.isLoading;
export const selectDefaultContext = ({ clusters }) => clusters.defaultContext;

export default clustersSlice.reducer;
