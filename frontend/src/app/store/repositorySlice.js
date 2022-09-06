import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getRepositoryList as getRepositoryListAPI,
  createRepository as createRepositoryAPI,
  deleteRepository as deleteRepositoryAPI,
} from '../api';

export const getRepositoryList = createAsyncThunk('repositories/getRepositoryList', async () => {
  try {
    const response = await getRepositoryListAPI();
    const data = await response.data;
    return data;
  } catch (e) {
    return [];
  }
});

export const createRepository = createAsyncThunk('repositories/createRepository', async ({ repository }) => {
  try {
    const response = await createRepositoryAPI(repository);
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
});

export const deleteRepository = createAsyncThunk('repositories/deleteRepository', async (repository) => {
  try {
    await deleteRepositoryAPI(repository);
  } catch (e) {
    // add error handling
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
    [createRepository.fulfilled]: (state, { payload }) => ({
      repositories: [...state.repositories, payload],
      isLoading: false,
    }),
    [createRepository.pending]: (state, { payload }) => ({
      ...state,
      isLoading: true,
    }),
    [createRepository.rejected]: (state, { payload }) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectRepositories = ({ repositories }) => repositories.repositories;
export const selectIsRepositoriesLoading = ({ repositories }) => repositories.isLoading;

export default repositoriesSlice.reducer;
