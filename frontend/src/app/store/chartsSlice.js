import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getChartList as getChartListAPI,
  getNamespacesList as getNamespacesListAPI,
  chartInstall as chartInstallAPI,
} from '../api';

export const getNamespacesList = createAsyncThunk('charts/getNamespacesList', async (param) => {
  try {
    const response = await getNamespacesListAPI(param);
    const data = await response.data;
    return data;
  } catch (e) {
    return [];
  }
});

export const getChartList = createAsyncThunk('charts/getChartList', async () => {
  try {
    const response = await getChartListAPI();
    const data = await response.data;
    return data;
  } catch (e) {
    return [];
  }
});

export const chartInstall = createAsyncThunk('charts/chartInstall', async (chart) => {
  try {
    const response = await chartInstallAPI(chart);
    const data = await response.data;
    return data;
  } catch (e) {
    return [];
  }
});

const chartsSlice = createSlice({
  name: 'charts/chartsList',
  initialState: {
    isLoading: false,
    charts: [],
    namespaces: [],
  },
  reducers: {},
  extraReducers: {
    [getChartList.fulfilled]: (state, { payload }) => ({
      charts: payload,
      isLoading: false,
    }),
    [getChartList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getChartList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [getNamespacesList.fulfilled]: (state, { payload }) => ({
      ...state,
      namespaces: payload,
    }),
    [chartInstall.fulfilled]: (state, { payload }) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectCharts = ({ charts }) => charts.charts;
export const selectNamespaces = ({ charts }) => charts.namespaces;
export const selectIsChartsLoading = ({ charts }) => charts.isLoading;

export default chartsSlice.reducer;
