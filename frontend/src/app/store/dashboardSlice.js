import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const DASHBOARD_API_PATH = '/api/v1/dashboard/';

export const getReleasesCount = createAsyncThunk('dashboard/getReleasesCount', async () => {
  try {
    const response = await axios.get(`${DASHBOARD_API_PATH}release-count`);
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

export const getRepositoriesCount = createAsyncThunk('dashboard/getRepositoriesCount', async () => {
  try {
    const response = await axios.get(`${DASHBOARD_API_PATH}repository-count`);
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

export const getChartsCount = createAsyncThunk('dashboard/getChartsCount', async () => {
  try {
    const response = await axios.get(`${DASHBOARD_API_PATH}chart-count`);
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

export const getContextsCount = createAsyncThunk('dashboard/getContextsCount', async () => {
  try {
    const response = await axios.get(`${DASHBOARD_API_PATH}context-count`);
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

export const getUnhealthyCount = createAsyncThunk('dashboard/getUnhealthyCount', async () => {
  try {
    const response = await axios.get(`${DASHBOARD_API_PATH}unhealthy-count`);
    const data = await response.data;

    return data;
  } catch (e) {
    return '-';
  }
});

export const getServicesCount = createAsyncThunk('dashboard/getServicesCount', async () => {
  try {
    const response = await axios.get(`${DASHBOARD_API_PATH}services-count`);
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
