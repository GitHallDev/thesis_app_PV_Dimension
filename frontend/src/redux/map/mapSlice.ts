import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LocationFeature } from "@/lib/mapbox/utils";

interface MapState {
  selectedLocation: LocationFeature | null;
  selectedLocations: LocationFeature[];
}

const initialState: MapState = {
  selectedLocation: null,
  selectedLocations: [],
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setSelectedLocations: (state, action) => {
      state.selectedLocations = action.payload;
    },
  },
});

export const { setSelectedLocations, setSelectedLocation } = mapSlice.actions;

export default mapSlice.reducer;
