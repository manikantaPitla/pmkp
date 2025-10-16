import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authReducer";
import messageReducer from "./features/messageReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messageReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/addUser", "messages/setChatMessages"],
        ignoredPaths: ["auth.user.lastLogin", "auth.user.lastTokenUpdate", "auth.user.heartbeatAt", "auth.user.disabledAt", "auth.user.enabledAt", "messages.messageList"],
      },
    }),
});

export default store;
