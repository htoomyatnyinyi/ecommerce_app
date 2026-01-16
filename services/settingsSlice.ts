import { createSlice } from "@reduxjs/toolkit";

interface SettingsState {
  hasSeenOnboarding: boolean;
}

const initialState: SettingsState = {
  hasSeenOnboarding: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    completeOnboarding: (state) => {
      state.hasSeenOnboarding = true;
    },
    resetOnboarding: (state) => {
      state.hasSeenOnboarding = false;
    },
  },
});

export const { completeOnboarding, resetOnboarding } = settingsSlice.actions;
export default settingsSlice.reducer;
