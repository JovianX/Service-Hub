import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getAccessTokensList as getAccessTokensListAPI,
  changeAccessTokenStatus as changeAccessTokenStatusAPI,
  deleteAccessToken as deleteAccessTokenAPI,
  createAccessToken as createAccessTokenAPI,
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

export const createAccessToken = createAsyncThunk('accessTokens/createAccessToken', async (tokenData, thunkAPI) => {
  try {
    const response = await createAccessTokenAPI(tokenData);
    const { data } = response;
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue('Failed to install the access token');
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
    console.log(e);
  }
});

export const deleteAccessToken = createAsyncThunk('accessTokens/deleteAccessToken', async (token) => {
  try {
    const response = await deleteAccessTokenAPI(token);
    const { data } = response;
    return data;
  } catch (e) {
    console.log(e);
  }
});

const accessTokensSlice = createSlice({
  name: 'accessTokens/accessTokensList',
  initialState: {
    isLoading: false,
    accessTokens: [],
    errorMessage: '',
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

    [createAccessToken.fulfilled]: (state, { payload }) => {
      state.accessTokens = [...state.accessTokens, payload];
      state.isLoading = false;
      state.errorMessage = '';
    },
    [createAccessToken.pending]: (state) => ({
      ...state,
      errorMessage: '',
    }),
    [createAccessToken.rejected]: (state, { payload }) => ({
      ...state,
      errorMessage: payload,
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

    [deleteAccessToken.fulfilled]: (state, { payload }) => ({
      accessTokens: payload,
      isLoading: false,
    }),
    [deleteAccessToken.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [deleteAccessToken.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectAccessTokens = ({ accessTokens }) => accessTokens.accessTokens;
export const selectIsAccessTokensLoading = ({ accessTokens }) => accessTokens.isLoading;
export const selectErrorMessage = ({ accessTokens }) => accessTokens.errorMessage;

export default accessTokensSlice.reducer;
