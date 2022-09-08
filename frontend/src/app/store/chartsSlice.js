import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getChartList as getChartListAPI, chartInstall as chartInstallAPI } from '../api';

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
    [chartInstall.fulfilled]: (state, { payload }) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectCharts = ({ charts }) => charts.charts;
export const selectIsChartsLoading = ({ charts }) => charts.isLoading;

export default chartsSlice.reducer;
