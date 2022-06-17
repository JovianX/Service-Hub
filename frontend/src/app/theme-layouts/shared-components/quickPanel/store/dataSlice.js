import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'quickPanel/data',
  initialState: {
    notes: [
      {
        id: 1,
        title: 'Best songs to listen while working',
        detail: 'Last edit: May 8th, 2015',
      },
      {
        id: 2,
        title: 'Useful subreddits',
        detail: 'Last edit: January 12th, 2015',
      },
    ],
    events: [
      {
        id: 1,
        title: 'Group Meeting',
        detail: 'In 32 Minutes, Room 1B',
      },
      {
        id: 2,

        title: 'Public Beta Release',
        detail: '11:00 PM',
      },
      {
        id: 3,
        title: 'Dinner with David',
        detail: '17:30 PM',
      },
      {
        id: 4,
        title: 'Q&A Session',
        detail: '20:30 PM',
      },
    ],
  },
  reducers: {},
});

export const selectQuickPanelData = ({ quickPanel }) => quickPanel.data;

export default dataSlice.reducer;
