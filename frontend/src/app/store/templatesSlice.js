import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getTemplatesList as getTemplatesListAPI,
  makeTemplateDefault as makeTemplateDefaultAPI,
  createTemplate as createTemplateAPI,
  deleteTemplate as deleteTemplateAPI,
  editTemplate as editTemplateAPI,
} from '../api';

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

export const createTemplate = createAsyncThunk('templates/createTemplate', async (template) => {
  try {
    const response = await createTemplateAPI(template);
    return response.data;
  } catch (e) {
    return {
      status: 'error',
      message: 'setting template wasn\'t successfull',
    };
  }
});

export const makeTemplateDefault = createAsyncThunk('templates/makeTemplateDefault', async (id) => {
  try {
    await makeTemplateDefaultAPI(id);
    return {
      status: 'success',
      message: '',
    };
  } catch (e) {
    return {
      status: 'error',
      message: 'setting default wasn\'t successfull',
    };
  }
});

export const deleteTemplate = createAsyncThunk('templates/deleteTemplate', async (id) => {
  try {
    await deleteTemplateAPI(id);
    return {
      status: 'success',
      message: 'template was successfully deleted',
    };
  } catch (e) {
    return {
      status: 'error',
      message: e.response.data.message,
    };
  }
});

export const editTemplate = createAsyncThunk('templates/editTemplate', async ({ id, template }) => {
  try {
    await editTemplateAPI(id, template);
    return {
      status: 'success',
      message: 'template was successfully edited',
    };
  } catch (e) {
    return {
      status: 'error',
      message: e.response.data.message,
    };
  }
});

const templatesSlice = createSlice({
  name: 'templates/templatesList',
  initialState: {
    isLoading: false,
    templates: [],
    infoMessage: {},
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
    [makeTemplateDefault.fulfilled]: (state, { payload }) => ({
      ...state,
      infoMessage: payload,
    }),
    [makeTemplateDefault.pending]: (state) => ({
      ...state,
    }),
    [makeTemplateDefault.rejected]: (state) => ({
      ...state,
    }),
    [deleteTemplate.fulfilled]: (state, { payload }) => ({
      ...state,
      infoMessage: payload,
    }),
    [deleteTemplate.pending]: (state) => ({
      ...state,
    }),
    [deleteTemplate.rejected]: (state) => ({
      ...state,
    }),
    [editTemplate.fulfilled]: (state, { payload }) => ({
      ...state,
      infoMessage: payload,
    }),
    [editTemplate.pending]: (state) => ({
      ...state,
    }),
    [editTemplate.rejected]: (state) => ({
      ...state,
    }),
  },
});

export const selectInfoMessage = ({ templates }) => templates.infoMessage;
export const selectTemplates = ({ templates }) => templates.templates;
export const selectIsTemplatesLoading = ({ templates }) => templates.isLoading;

export default templatesSlice.reducer;
