import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getReleasesList,
  deleteRelease as deleteReleaseAPI,
  createReleaseTtl as createReleaseTtlAPI,
  deleteReleaseTtl as deleteReleaseTtlAPI,
} from '../api';

export const getReleases = createAsyncThunk('releases/getReleasesList', async () => {
  try {
    const response = await getReleasesList();
    const { data } = response;
    return data;
  } catch (e) {
    return [];
  }
});

export const deleteRelease = createAsyncThunk('releases/deleteRelease', async ({ context_name, namespace, name }) => {
  try {
    await deleteReleaseAPI(context_name, namespace, name);
  } catch (e) {
    // handle error state
  }
});

export const createReleaseTtl = createAsyncThunk(
  'releases/createReleaseTtl',
  async ({ context_name, namespace, name, minutes }) => {
    try {
      await createReleaseTtlAPI(context_name, namespace, name, minutes);
      return {
        status: 'success',
        message: 'adding ttl was successful',
      };
    } catch (e) {
      return {
        status: 'error',
        message: 'an error occurred when adding ttl',
      };
    }
  },
);

export const deleteReleaseTtl = createAsyncThunk(
  'releases/deleteReleaseTtl',
  async ({ context_name, namespace, name }) => {
    try {
      await deleteReleaseTtlAPI(context_name, namespace, name);
      return {
        status: 'success',
        message: 'deleting ttl was successful',
      };
    } catch (e) {
      return {
        status: 'error',
        message: 'an error occurred when deleting ttl',
      };
    }
  },
);

const releasesSlice = createSlice({
  name: 'releases/releasesList',
  initialState: {
    isLoading: false,
    releases: [],
  },
  reducers: {},
  extraReducers: {
    [getReleases.fulfilled]: (state, { payload }) => ({
      releases: payload,
      isLoading: false,
    }),
    [getReleases.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getReleases.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectReleases = ({ releases }) => releases.releases;
export const selectIsReleasesLoading = ({ releases }) => releases.isLoading;

export default releasesSlice.reducer;
