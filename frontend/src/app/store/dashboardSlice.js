import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getReleaseCount as getReleasesCountAPI,
  getRepositoryCount as getRepositoriesCountAPI,
  getChartCount as getChartsCountAPI,
  getContextCount as getContextsCountAPI,
  getUnhealthyCount as getUnhealthyCountAPI,
  getServiceCount as getServicesCountAPI,
} from '../api';

export const getReleasesCount = createAsyncThunk('dashboard/getReleasesCount', async () => {
  try {
    const response = await getReleasesCountAPI();
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

export const getRepositoriesCount = createAsyncThunk('dashboard/getRepositoriesCount', async () => {
  try {
    const response = await getRepositoriesCountAPI();
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

export const getChartsCount = createAsyncThunk('dashboard/getChartsCount', async () => {
  try {
    const response = await getChartsCountAPI();
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

export const getContextsCount = createAsyncThunk('dashboard/getContextsCount', async () => {
  try {
    const response = await getContextsCountAPI();
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

export const getUnhealthyCount = createAsyncThunk('dashboard/getUnhealthyCount', async () => {
  try {
    const response = await getUnhealthyCountAPI();
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

export const getServicesCount = createAsyncThunk('dashboard/getServicesCount', async () => {
  try {
    const response = await getServicesCountAPI();
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard/counts',
  initialState: {
    releases: null,
    repositories: null,
    charts: null,
    contexts: null,
    unhealthy: null,
    services: null,
  },
  reducers: {},
  extraReducers: {
    [getReleasesCount.fulfilled]: (state, { payload }) => ({
      ...state,
      releases: payload,
    }),
    [getRepositoriesCount.fulfilled]: (state, { payload }) => ({
      ...state,
      repositories: payload,
    }),
    [getChartsCount.fulfilled]: (state, { payload }) => ({
      ...state,
      charts: payload,
    }),
    [getContextsCount.fulfilled]: (state, { payload }) => ({
      ...state,
      contexts: payload,
    }),
    [getUnhealthyCount.fulfilled]: (state, { payload }) => ({
      ...state,
      unhealthy: payload,
    }),
    [getServicesCount.fulfilled]: (state, { payload }) => ({
      ...state,
      services: payload,
    }),
  },
});

export const selectCounts = ({ dashboard }) => dashboard;

export default dashboardSlice.reducer;
