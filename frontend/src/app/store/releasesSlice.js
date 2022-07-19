import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getReleasesList, deleteRelease as deleteReleaseAPI } from '../api';

export const getReleases = createAsyncThunk('releases/getReleasesList', async () => {
  try {
    const response = await getReleasesList();

    const data = await response.data;

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
