import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  messageList: [],
};

const messageReducer = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setChatMessages: (state, action) => {
      state.messageList = action.payload;
    },
    addChatMessage: (state, action) => {
      state.messageList.push(action.payload);
    },
    removeChatMessages: (state) => {
      state.messageList = [];
    },
    updateChatMessage: (state, action) => {
      const index = state.messageList.findIndex(
        (msg) => msg.messageId === action.payload.messageId
      );
      if (index !== -1) {
        state.messageList[index].status = action.payload.status;
      }
    },
  },
});

export const {
  setChatMessages,
  addChatMessage,
  updateChatMessage,
  removeChatMessages,
} = messageReducer.actions;
export default messageReducer.reducer;
