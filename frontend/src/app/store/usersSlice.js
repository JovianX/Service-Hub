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
  } catch (e) {
    console.log(e);
  }
});

const usersSlice = createSlice({
  name: 'users/usersList',
  initialState: {
    isLoading: false,
    users: [],
    createdUser: {},
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
      createdUser: payload,
      isLoading: false,
    }),
    [deleteUser.fulfilled]: (state, { payload }) => ({
      users: payload,
      isLoading: false,
    }),
  },
});

export const selectCreatedUser = ({ users }) => users?.createdUser;
export const selectUsers = ({ users }) => users.users;
export const selectIsUsersLoading = ({ users }) => users.isLoading;

export default usersSlice.reducer;
