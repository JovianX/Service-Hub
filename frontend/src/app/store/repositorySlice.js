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

export const createRepository = createAsyncThunk('repositories/createRepository', async (repository) => {
  try {
    const response = await createRepositoryAPI(repository);
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
    if (!e.response.data) {
      const data = {
        message: 'Oops, something went wrong',
        status: 'ERROR',
      };
      return data;
    }
    const data = {
      message: e.response.data.message,
      status: 'ERROR',
    };
    return data;
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
    errorsInfo: {},
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
      ...state,
      isLoading: false,
      errorsInfo: payload,
    }),
    [createRepository.pending]: (state, { payload }) => ({
      ...state,
    }),
    [createRepository.rejected]: (state, { payload }) => ({
      ...state,
    }),
  },
});

export const selectErrorsInfo = ({ repositories }) => repositories.errorsInfo;
export const selectRepositories = ({ repositories }) => repositories.repositories;
export const selectIsRepositoriesLoading = ({ repositories }) => repositories.isLoading;

export default repositoriesSlice.reducer;
