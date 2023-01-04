import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAccessTokensList as getAccessTokensListAPI } from '../api';

export const getAccessTokensList = createAsyncThunk('accessTokens/getAccessTokensList', async () => {
  try {
    const response = await getAccessTokensListAPI();
    const { data } = response;
    return data;
  } catch (e) {
    return [];
  }
});

const accessTokensSlice = createSlice({
  name: 'accessTokens/accessTokensList',
  initialState: {
    isLoading: false,
    accessTokens: [],
  },
  reducers: {},
  extraReducers: {
    [getAccessTokensList.fulfilled]: (state, { payload }) => ({
      accessTokens: payload,
      isLoading: false,
    }),
    [getAccessTokensList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getAccessTokensList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectAccessTokens = ({ accessTokens }) => accessTokens.accessTokens;
export const selectIsAccessTokensLoading = ({ accessTokens }) => accessTokens.isLoading;

export default accessTokensSlice.reducer;
