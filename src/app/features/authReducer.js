import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { addUser, clearUser } = authReducer.actions;
export default authReducer.reducer;
