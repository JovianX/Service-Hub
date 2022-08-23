import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getInvitationList as getInvitationListAPI } from '../api';

export const getInvitesList = createAsyncThunk('invitations/getInvitesList', async () => {
  try {
    const response = await getInvitationListAPI();
    console.log('response', response)

    const data = await response.data;

    return data;
  } catch (e) {
    console.log('error', e)
    return [];
  }
});

const invitesSlice = createSlice({
  name: 'invitations/invitesList',
  initialState: {
    isLoading: false,
    invites: [],
  },
  reducers: {},
  extraReducers: {
    [getInvitesList.fulfilled]: (state, { payload }) => ({
      invites: payload,
      isLoading: false,
    }),
    [getInvitesList.pending]: (state) => ({
      ...state,
      isLoading: true,
    }),
    [getInvitesList.rejected]: (state) => ({
      ...state,
      isLoading: false,
    }),
  },
});

export const selectInvites = ({ invites }) => invites.invites;
export const selectIsInvitesLoading = ({ invites }) => invites.isLoading;

export default invitesSlice.reducer;
