import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import meetingReducer from "./slices/meetingSlice";
import notificationReducer from "./slices/notificationSlice";
import documentReducer from "./slices/documentSlice";
import authReducer from "./slices/authSlice";
import reportReducer from "./slices/reportSlice";
import noticeReducer from "./slices/noticeSlice";
import uiReducer from "./uiSlice";
import languageReducer from "./slices/languageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    meeting: meetingReducer,
    notification: notificationReducer,
    documents: documentReducer,
    reports: reportReducer,
    notice: noticeReducer,
    ui: uiReducer,
    language: languageReducer,
  },
});