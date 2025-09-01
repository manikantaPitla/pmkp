import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  messageList: [],
  pagination: {
    hasMore: true,
    isLoadingMore: false,
    oldestTimestamp: null,
    newestTimestamp: null,
    totalCount: 0,
  },
  isInitialized: false,
};

const messageReducer = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setChatMessages: (state, action) => {
      state.messageList = action.payload;
      state.isInitialized = true;

      if (action.payload.length > 0) {
        state.pagination.oldestTimestamp = action.payload[0].timestamp;
        state.pagination.newestTimestamp = action.payload[action.payload.length - 1].timestamp;

        state.pagination.hasMore = action.payload.length >= 30; // MESSAGES_PER_PAGE
      } else {
        state.pagination.hasMore = false;
      }
    },
    addChatMessage: (state, action) => {
      state.messageList.push(action.payload);
      state.pagination.newestTimestamp = action.payload.timestamp;
    },
    prependOlderMessages: (state, action) => {
      state.messageList.unshift(...action.payload);
      if (action.payload.length > 0) {
        state.pagination.oldestTimestamp = action.payload[0].timestamp;
      }
    },
    appendNewerMessages: (state, action) => {
      state.messageList.push(...action.payload);
      if (action.payload.length > 0) {
        state.pagination.newestTimestamp = action.payload[action.payload.length - 1].timestamp;
      }
    },
    removeChatMessages: state => {
      state.messageList = [];
      state.pagination = initialState.pagination;
      state.isInitialized = false;
    },
    updateChatMessage: (state, action) => {
      const index = state.messageList.findIndex(msg => msg.messageId === action.payload.messageId);
      if (index !== -1) {
        if (action.payload.status) state.messageList[index].status = action.payload.status;
        if (action.payload.progress) state.messageList[index].media.progress = action.payload.progress;
        if (action.payload.message) state.messageList[index].message = action.payload.message;
        if (action.payload.isEdited !== undefined) state.messageList[index].isEdited = action.payload.isEdited;
        if (action.payload.editedAt) state.messageList[index].editedAt = action.payload.editedAt;
        if (action.payload.isSeen !== undefined) state.messageList[index].isSeen = action.payload.isSeen;
        if (action.payload.seenAt) state.messageList[index].seenAt = action.payload.seenAt;
      }
    },
    setPaginationState: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLoadingMore: (state, action) => {
      state.pagination.isLoadingMore = action.payload;
    },
    setHasMore: (state, action) => {
      state.pagination.hasMore = action.payload;
    },
    deleteChatMessage: (state, action) => {
      state.messageList = state.messageList.filter(msg => msg.messageId !== action.payload);
    },
  },
});

export const {
  setChatMessages,
  addChatMessage,
  prependOlderMessages,
  appendNewerMessages,
  updateChatMessage,
  removeChatMessages,
  setPaginationState,
  setLoadingMore,
  setHasMore,
  deleteChatMessage,
} = messageReducer.actions;
export default messageReducer.reducer;
