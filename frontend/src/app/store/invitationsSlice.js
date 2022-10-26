import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  sendInvitation as sendInvitationAPI,
  getInvitationsList as getInvitationsListAPI,
  addInvitation as addInvitationAPI,
  deleteInvitation as deleteInvitationAPI,
  getInvitedUserEmail as getInvitedUserEmailAPI,
} from '../api';

export const getInvitationsList = createAsyncThunk('invitations/getInvitationsList', async () => {
  try {
    const response = await getInvitationsListAPI();
    return response.data;
  } catch (e) {
    console.log(e);
    return [];
  }
});

export const addInvitation = createAsyncThunk('invitations/addInvitation', async ({ user }) => {
  try {
    const response = await addInvitationAPI(user);
    return response.data;
  } catch (e) {
    if (e?.response.data.message) {
      return {
        status: 'error',
        message: e.response.data.message,
      };
    }
    return {
      status: 'error',
      message: 'Failed to add invite',
    };
  }
});

export const deleteInvitation = createAsyncThunk('invitations/deleteInvitation', async (id) => {
  try {
    const response = await deleteInvitationAPI(id);
    return response.data;
  } catch (e) {
    if (e?.response.data.message) {
      return {
        status: 'error',
        message: e.response.data.message,
      };
    }
    return {
      status: 'error',
      message: 'Failed to delete invite',
    };
  }
});

export const sendInvitation = createAsyncThunk('invitations/sendInvitation', async (id) => {
  try {
    await sendInvitationAPI(id);
    return {
      status: 'success',
      message: 'Invitation sent successfully',
    };
  } catch (e) {
    if (e?.response.data.message) {
      return {
        status: 'error',
        message: e.response.data.message,
      };
    }
    return {
      status: 'error',
      message: 'Failed to send invite',
    };
  }
});

export const getInvitedUserEmail = createAsyncThunk('invitations/getInvitedUserEmail', async (id) => {
  try {
    const response = await getInvitedUserEmailAPI(id);
    return response.data;
  } catch (e) {
    console.log(e);
  }
});

const invitationsSlice = createSlice({
  name: 'invitations/invitationsActions',
  initialState: {
    isLoading: false,
    invitations: [],
  },
  reducers: {},
  extraReducers: {
    [getInvitationsList.fulfilled]: (state, { payload }) => ({
      invitations: payload,
      isLoading: false,
    }),
    [getInvitationsList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getInvitationsList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [addInvitation.fulfilled]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [addInvitation.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [addInvitation.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [deleteInvitation.fulfilled]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [deleteInvitation.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [deleteInvitation.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [sendInvitation.fulfilled]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [sendInvitation.pending]: (state) => ({
      ...state,
    }),
  },
});

export const selectInvitation = ({ invitations }) => invitations.invitations;
export const selectIsInvitationsLoading = ({ invitations }) => invitations.isLoading;

export default invitationsSlice.reducer;
