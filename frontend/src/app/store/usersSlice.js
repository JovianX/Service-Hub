import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  deleteUser as deleteUserAPI,
  getUsersList as getUsersListAPI,
  activateUser as activateUserAPi,
  deactivateUser as deactivateUserAPI,
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

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  try {
    const response = await deleteUserAPI(id);
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
  }
});

export const activateUser = createAsyncThunk('users/activateUser', async (id) => {
  try {
    const response = await activateUserAPi(id);
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
  }
});

export const deactivateUser = createAsyncThunk('users/deactivateUser', async (id) => {
  try {
    const response = await deactivateUserAPI(id);
    const data = await response.data;
    return data;
  } catch (e) {
    console.log(e);
  }
});

const usersSlice = createSlice({
  name: 'users/usersActions',
  initialState: {
    isLoading: false,
    users: [],
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
    [deactivateUser.fulfilled]: (state, { payload }) => ({
      users: payload,
      isLoading: false,
    }),
    [deactivateUser.pending]: (state, { payload }) => ({
      ...state,
      isLoading: true,
    }),
    [deactivateUser.rejected]: (state, { payload }) => ({
      ...state,
      isLoading: false,
    }),
    [activateUser.fulfilled]: (state, { payload }) => ({
      ...state,
    }),
    [deactivateUser.fulfilled]: (state, { payload }) => ({
      ...state,
    }),
  },
});

export const selectUsers = ({ users }) => users.users;
export const selectIsUsersLoading = ({ users }) => users.isLoading;

export default usersSlice.reducer;
