import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  sendInvite as sendInviteAPI,
  getUsersList as getUsersListAPI,
  addUser as addUserAPI,
  deleteUser as deleteUserAPI,
} from '../api';

export const getUsersList = createAsyncThunk('users/getUsersList', async () => {
  try {
    const response = await getUsersListAPI();
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
});

export const addUser = createAsyncThunk('users/addUser', async ({ user }) => {
  try {
    const response = await addUserAPI(user);
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  try {
    const response = await deleteUserAPI(id);
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
  }
});

export const sendInvite = createAsyncThunk('users/sendInvite', async (id) => {
  try {
    await sendInviteAPI(id);
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

const usersSlice = createSlice({
  name: 'users/usersActions',
  initialState: {
    isLoading: false,
    users: [],
    infoMessage: {
      text: ' ',
      status: ' ',
    },
  },
  reducers: {},
  extraReducers: {
    [getUsersList.fulfilled]: (state, { payload }) => ({
      users: payload,
      isLoading: false,
    }),
    [getUsersList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getUsersList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [addUser.fulfilled]: (state, { payload }) => ({
      users: [...state.users, payload],
      isLoading: false,
    }),
    [addUser.pending]: (state, { payload }) => ({
      ...state,
      isLoading: true,
    }),
    [addUser.rejected]: (state, { payload }) => ({
      ...state,
      isLoading: false,
    }),
    [deleteUser.fulfilled]: (state, { payload }) => ({
      users: payload,
      isLoading: false,
    }),
    [deleteUser.pending]: (state, { payload }) => ({
      ...state,
      isLoading: true,
    }),
    [deleteUser.rejected]: (state, { payload }) => ({
      ...state,
      isLoading: false,
    }),
    [sendInvite.fulfilled]: (state, { payload }) => ({
      ...state,
      infoMessage: payload,
    }),
    [sendInvite.pending]: (state, { payload }) => ({
      ...state,
      infoMessage: {},
    }),
  },
});

export const selectInfoMessage = ({ users }) => users.infoMessage;
export const selectUsers = ({ users }) => users.users;
export const selectIsUsersLoading = ({ users }) => users.isLoading;

export default usersSlice.reducer;