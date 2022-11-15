import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getHemlReleaseHistory as getHemlReleaseHistoryAPI } from '../api';

export const getHemlReleaseHistory = createAsyncThunk(
  'release/getHemlReleaseHistory',
  async ({ context_name, namespace, release_name }) => {
    try {
      const response = await getHemlReleaseHistoryAPI({ context_name, namespase: namespace, release_name });
      const { data } = response;
      return data;
    } catch (e) {
      return [];
    }
  },
);

const releaseSlice = createSlice({
  name: 'release/releaseItem',
  initialState: {
    releaseHistory: [],
  },
  reducers: {},
  extraReducers: {
    [getHemlReleaseHistory.fulfilled]: (state, { payload }) => ({
      releaseHistory: payload,
    }),
    [getHemlReleaseHistory.pending]: (state) => ({
      ...state,
    }),
    [getHemlReleaseHistory.rejected]: (state) => ({
      ...state,
    }),
  },
});

export const selectReleaseHistory = ({ release }) => release.releaseHistory;

export default releaseSlice.reducer;
