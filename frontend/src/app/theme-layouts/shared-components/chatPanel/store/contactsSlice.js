import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { closeChatPanel } from './stateSlice';

export const getContacts = createAsyncThunk('chatPanel/contacts/getContacts', async (params) => {
  const response = await axios.get('/api/chat/contacts', { params });

  const data = await response.data;

  return data;
});

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactById } =
  contactsAdapter.getSelectors((state) => state.chatPanel.contacts);

const contactsSlice = createSlice({
  name: 'chatPanel/contacts',
  initialState: contactsAdapter.getInitialState({
    selectedContactId: null,
  }),
  reducers: {
    setSelectedContactId: (state, action) => {
      state.selectedContactId = action.payload;
    },
    removeSelectedContactId: (state, action) => {
      state.selectedContactId = null;
    },
  },
  extraReducers: {
    [getContacts.fulfilled]: contactsAdapter.setAll,
    [closeChatPanel]: (state, action) => {
      state.selectedContactId = null;
    },
  },
});

export const { setSelectedContactId, removeSelectedContactId } = contactsSlice.actions;

export const selectSelectedContactId = ({ chatPanel }) => chatPanel.contacts.selectedContactId;

export default contactsSlice.reducer;
