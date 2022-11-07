import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getTemplatesList as getTemplatesListAPI,
  createTemplate as createTemplateAPI,
  deleteTemplate as deleteTemplateAPI,
  editTemplate as editTemplateAPI,
  makeTemplateDefault as makeTemplateDefaultAPI,
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
    if (e?.response?.data?.message) {
      return {
        status: 'error',
        message: e.response.data.message,
      };
    }
    return {
      status: 'error',
      message: 'Failed to create template',
    };
  }
});

export const makeTemplateDefault = createAsyncThunk('templates/makeTemplateDefault', async (id) => {
  try {
    const response = await makeTemplateDefaultAPI(id);
    return response.data;
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
    if (e?.response?.data?.message) {
      return {
        status: 'error',
        message: e.response.data.message,
      };
    }
    return {
      status: 'error',
      message: 'Failed to delete template',
    };
  }
});

export const editTemplate = createAsyncThunk('templates/editTemplate', async ({ id, requestBody }) => {
  try {
    const response = await editTemplateAPI(id, requestBody);
    return response.data;
  } catch (e) {
    return {
      status: 'error',
      message: 'editing template wasn\'t successfull',
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
