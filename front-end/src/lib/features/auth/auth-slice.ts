import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  token: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  id: null,
  first_name: "",
  last_name: "",
  email: "",
  username: "",
  token: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        username: string;
        token: string;
      }>
    ) => {
      state.id = action.payload.id;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.id = null;
      state.first_name = "";
      state.last_name = "";
      state.email = "";
      state.username = "";
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
