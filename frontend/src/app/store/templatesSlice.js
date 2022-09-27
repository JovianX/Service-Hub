import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getTemplatesList as getTemplatesListAPI, makeTemplateDefault as makeTemplateDefaultAPI } from '../api';

export const getTemplatesList = createAsyncThunk('templates/getTemplatesList', async () => {
  try {
    const response = await getTemplatesListAPI();
    const { data } = response;
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
});

export const makeTemplateDefault = createAsyncThunk('templates/makeTemplateDefault', async (id) => {
  try {
    await makeTemplateDefaultAPI(id);
    return {
      status: 'success',
      message: 'setting default was successful',
    };
  } catch (e) {
    return {
      status: 'error',
      message: 'setting default wasn\'t successful',
    };
  }
});

const templatesSlice = createSlice({
  name: 'templates/templatesList',
  initialState: {
    isLoading: false,
    templates: [],
  },
  reducers: {},
  extraReducers: {
    [getTemplatesList.fulfilled]: (state, { payload }) => ({
      templates: payload,
      isLoading: false,
    }),
    [getTemplatesList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getTemplatesList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectTemplates = ({ templates }) => templates.templates;
export const selectIsTemplatesLoading = ({ templates }) => templates.isLoading;

export default templatesSlice.reducer;
