import { combineReducers } from '@reduxjs/toolkit';
import chat from './chatSlice';
import chats from './chatsSlice';
import contacts from './contactsSlice';
import state from './stateSlice';
import user from './userSlice';

const reducer = combineReducers({
  user,
  contacts,
  chat,
  chats,
  state,
});

export default reducer;
