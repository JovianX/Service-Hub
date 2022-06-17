import { createSlice } from '@reduxjs/toolkit';

const stateSlice = createSlice({
  name: 'chatPanel/state',
  initialState: false,
  reducers: {
    toggleChatPanel: (state, action) => !state,
    openChatPanel: (state, action) => true,
    closeChatPanel: (state, action) => false,
  },
  extraReducers: {},
});

export const { toggleChatPanel, openChatPanel, closeChatPanel } = stateSlice.actions;

export const selectChatPanelState = ({ chatPanel }) => chatPanel.state;

export default stateSlice.reducer;
