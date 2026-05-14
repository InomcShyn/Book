import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/auth.slice";
import outletReducer from "../features/Outlet/outlet.slice";
import { serviceListenerMiddleware } from "./middleware/serviceMiddleware";
import { setStore } from "./storeRef";

const rootReducer = combineReducers({
  auth: authReducer,
  outlet: outletReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(serviceListenerMiddleware.middleware),
});

setStore(store);
