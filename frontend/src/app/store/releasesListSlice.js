import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getReleasesList = createAsyncThunk('releases/getReleasesList', async () => {
  try {
    const response = await axios.get('/api/v1/helm/release/list');

    const data = await response.data;

    return data;
  } catch (e) {
    return [];
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
    [getReleasesList.fulfilled]: (state, { payload }) => ({
      releases: payload,
      isLoading: false,
    }),
    [getReleasesList.pending]: () => ({
      isLoading: true,
    }),
    [getReleasesList.rejected]: () => ({
      isLoading: false,
    }),
  },
});

export const selectReleases = ({ releases }) => releases.releases;
export const selectIsReleasesLoading = ({ releases }) => releases.isLoading;

export default releasesSlice.reducer;
