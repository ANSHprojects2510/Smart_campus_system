import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Userslice";

// Create the Redux store
const store = configureStore({
  reducer: {
    user: userReducer
  },
});

// Export as default so main.jsx can import without {}
export default store;


