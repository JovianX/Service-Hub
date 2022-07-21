import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getRepositoryList as getRepositoryListAPI } from '../api';

export const getRepositoryList = createAsyncThunk('repositories/getRepositoryList', async () => {
  try {
    const response = await getRepositoryListAPI();

    const data = await response.data;

    return data;
  } catch (e) {
    return [];
  }
});

const repositoriesSlice = createSlice({
  name: 'repositories/repositoryList',
  initialState: {
    isLoading: false,
    repositories: [],
  },
  reducers: {},
  extraReducers: {
    [getRepositoryList.fulfilled]: (state, { payload }) => ({
      repositories: payload,
      isLoading: false,
    }),
    [getRepositoryList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getRepositoryList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectRepositories = ({ repositories }) => repositories.repositories;
export const selectIsRepositoriesLoading = ({ repositories }) => repositories.isLoading;

export default repositoriesSlice.reducer;
