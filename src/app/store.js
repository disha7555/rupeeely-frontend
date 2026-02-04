import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
//import messageReducer from "../features/message/messageSlice";
const store = configureStore({
  reducer: {
    theme: themeReducer,
    //message:messageReducer
  },
});

export default store;
