import { createSlice } from '@reduxjs/toolkit';

const stateSlice = createSlice({
  name: 'quickPanel/state',
  initialState: false,
  reducers: {
    toggleQuickPanel: (state, action) => !state,
    openQuickPanel: (state, action) => true,
    closeQuickPanel: (state, action) => false,
  },
});

export const { toggleQuickPanel, openQuickPanel, closeQuickPanel } = stateSlice.actions;

export const selectQuickPanelState = ({ quickPanel }) => quickPanel.state;

export default stateSlice.reducer;
