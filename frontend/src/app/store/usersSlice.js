import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  deleteUser as deleteUserAPI,
  getUsersList as getUsersListAPI,
  activateUser as activateUserAPi,
  deactivateUser as deactivateUserAPI,
  changeUserRole as changeUserRoleAPI,
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
    return response.data;
  } catch (e) {
    console.log(e);
  }
});

export const deactivateUser = createAsyncThunk('users/deactivateUser', async (id) => {
  try {
    const response = await deactivateUserAPI(id);
    return response.data;
  } catch (e) {
    console.log(e);
  }
});

export const changeUserRole = createAsyncThunk('users/changeUserRole', async (userData) => {
  try {
    const response = await changeUserRoleAPI(userData);
    return {
      status: 'success',
      data: response.data,
    };
  } catch (e) {
    if (e.response.data?.message) {
      return {
        status: 'error',
        message: e.response.data.message,
      };
    }
    return {
      status: 'error',
      message: 'Failed to change role',
    };
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
    }),
    [getUsersList.pending]: (state) => ({
      ...state,
    }),
    [getUsersList.rejected]: (state) => ({
      ...state,
    }),
    [deactivateUser.fulfilled]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [deactivateUser.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [deactivateUser.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [activateUser.fulfilled]: (state) => ({
      ...state,
      isLoading: false,
    }),
    [activateUser.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [activateUser.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectUsers = ({ users }) => users.users;
export const selectIsUsersLoading = ({ users }) => users.isLoading;

export default usersSlice.reducer;
