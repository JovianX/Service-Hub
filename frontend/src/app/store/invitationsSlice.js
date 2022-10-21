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
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
});

export const addInvitation = createAsyncThunk('invitations/addInvitation', async ({ user }) => {
  try {
    const response = await addInvitationAPI(user);
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
});

export const deleteInvitation = createAsyncThunk('invitations/deleteInvitation', async (id) => {
  try {
    const response = await deleteInvitationAPI(id);
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
  }
});

export const sendInvitation = createAsyncThunk('invitations/sendInvitation', async (id) => {
  try {
    await sendInvitationAPI(id);
    return {
      text: 'Invitation sent successfully',
      status: 'success',
    };
  } catch (e) {
    return {
      text: e.response.data.message,
      status: 'error',
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
    infoMessage: {
      text: ' ',
      status: ' ',
    },
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
    [addInvitation.fulfilled]: (state, { payload }) => ({
      invitations: [...state.invitations, payload],
      isLoading: false,
    }),
    [addInvitation.pending]: (state, { payload }) => ({
      ...state,
      isLoading: true,
    }),
    [addInvitation.rejected]: (state, { payload }) => ({
      ...state,
      isLoading: false,
    }),
    [deleteInvitation.fulfilled]: (state, { payload }) => ({
      invitations: payload,
      isLoading: false,
    }),
    [deleteInvitation.pending]: (state, { payload }) => ({
      ...state,
      isLoading: true,
    }),
    [deleteInvitation.rejected]: (state, { payload }) => ({
      ...state,
      isLoading: false,
    }),
    [sendInvitation.fulfilled]: (state, { payload }) => ({
      ...state,
      infoMessage: payload,
    }),
    [sendInvitation.pending]: (state, { payload }) => ({
      ...state,
      infoMessage: {},
    }),
  },
});

export const selectInfoMessage = ({ invitations }) => invitations.infoMessage;
export const selectInvitation = ({ invitations }) => invitations.invitations;
export const selectIsInvitationsLoading = ({ invitations }) => invitations.isLoading;

export default invitationsSlice.reducer;
