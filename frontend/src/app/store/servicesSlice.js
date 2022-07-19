import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getServiceList as getServicesListAPI } from '../api';

export const getServiceList = createAsyncThunk('services/getServicesList', async () => {
  try {
    const response = await getServicesListAPI();

    const data = await response.data;

    return data;
  } catch (e) {
    return [];
  }
});

const servicesSlice = createSlice({
  name: 'services/servicesList',
  initialState: {
    isLoading: false,
    services: [],
  },
  reducers: {},
  extraReducers: {
    [getServiceList.fulfilled]: (state, { payload }) => ({
      services: payload,
      isLoading: false,
    }),
    [getServiceList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getServiceList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectServices = ({ services }) => services.services;
export const selectIsServicesLoading = ({ services }) => services.isLoading;

export default servicesSlice.reducer;
