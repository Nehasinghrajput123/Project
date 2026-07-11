import { createSlice } from "@reduxjs/toolkit";

// Page refresh hone par localStorage se data fetch karne ke liye setup
const initialState = {
  token: localStorage.getItem("token") || null,
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Jab user successfully Login kare
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    // New Reducer: Jab user successfully Register ho jaye aur direct login karwana ho
    registerSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    // Jab user Logout kare
    logout: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// registerSuccess ko bhi export kar diya hai
export const { loginSuccess, registerSuccess, logout } = authSlice.actions;

export default authSlice.reducer;