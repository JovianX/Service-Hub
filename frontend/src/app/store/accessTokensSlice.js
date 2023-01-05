import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getAccessTokensList as getAccessTokensListAPI,
  changeAccessTokenStatus as changeAccessTokenStatusAPI,
} from '../api';

export const getAccessTokensList = createAsyncThunk('accessTokens/getAccessTokensList', async () => {
  try {
    const response = await getAccessTokensListAPI();
    const { data } = response;
    return data;
  } catch (e) {
    return [];
  }
});

export const changeAccessTokenStatus = createAsyncThunk('accessTokens/changeAccessTokenStatus', async (requestData) => {
  const { token } = requestData;
  const status = { status: requestData.status };
  try {
    const response = await changeAccessTokenStatusAPI(token, status);
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
    [changeAccessTokenStatus.fulfilled]: (state, { payload }) => {
      state.accessTokens = [
        ...state.accessTokens.map((accessToken) => {
          if (accessToken.id === payload.id) {
            return payload;
          }
          return accessToken;
        }),
      ];
      state.isLoading = false;
    },
    [changeAccessTokenStatus.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [changeAccessTokenStatus.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectAccessTokens = ({ accessTokens }) => accessTokens.accessTokens;
export const selectIsAccessTokensLoading = ({ accessTokens }) => accessTokens.isLoading;

export default accessTokensSlice.reducer;
