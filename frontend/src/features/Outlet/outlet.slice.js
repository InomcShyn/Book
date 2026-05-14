import { createSlice } from "@reduxjs/toolkit";

const initialState= {
  loading: {
    actions: {},
    activeLoaders: 0,
  }
}

const outletSlice = createSlice({
  name: 'outlet',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { actionType, isLoading } = action.payload;

      if (isLoading) {
        state.loading.actions[actionType] = true;
        state.loading.activeLoaders += 1;
      } else {
        delete state.loading.actions[actionType];
        state.loading.activeLoaders = Math.max(0, state.loading.activeLoaders - 1);
      }
    }
  }
})

export const { setLoading } = outletSlice.actions;
export const selectGlobalLoading = (state) => state.outlet.loading.activeLoaders > 0;
export default outletSlice.reducer;