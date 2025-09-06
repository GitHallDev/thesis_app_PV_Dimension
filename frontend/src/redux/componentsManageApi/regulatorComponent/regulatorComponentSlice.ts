// src/redux/componentsManageApi/regulatorComponent/regulatorComponentSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import regulatorComponentApi from "./regulatorComponentApi";

//
import { type TableData } from "@/components_manage/regulatorComponent/columns";

interface InverterState {
  items: TableData[];
}

const initialState: InverterState = {
  items: [],
};

const regulatorComponentSlice = createSlice({
  name: "regulatorComponent",
  initialState,
  reducers: {
    // si je veux des reducers manuels (optionel)
  },
  extraReducers: (builder) => {
    // ✅ Connecter le slice avec RTK Query

    // getAll
    builder.addMatcher(
      regulatorComponentApi.endpoints.getAllRegulatorComponentByOwner.matchFulfilled,
      (state, { payload }) => {
        state.items = payload.data; // payload = liste renvoyée par l'API
      }
    );

     // getOne
    // builder.addMatcher(
    //   regulatorComponentApi.endpoints.getRegulatorComponent.matchFulfilled,
    //   (state, { payload }) => {
    //     const index = state.items.findIndex((c) => c.id === payload.id);
    //     if (index >= 0) {
    //       state.items[index] = payload;
    //     } else {
    //       state.items.push(payload);
    //     }
    //   }
    // );

    // create
    builder.addMatcher(
      regulatorComponentApi.endpoints.createRegulatorComponent.matchFulfilled,
      (state, { payload }) => {
        state.items.push(payload.data);
      }
    );

        // update
    builder.addMatcher(
      regulatorComponentApi.endpoints.updateRegulatorComponent.matchFulfilled,
      (state, { payload }) => {
        const index = state.items.findIndex((c) => c.id === payload.data.id);
        if (index >= 0) {
          state.items[index] = payload.data;
        }
      }
    );

    // delete
    builder.addMatcher(
      regulatorComponentApi.endpoints.deleteRegulatorComponent.matchFulfilled,
      (state, { meta }) => {
        const id = meta.arg.originalArgs as string;
        state.items = state.items.filter((c) => c.id !== id);
      }
    );

  },
});

export const {  } = regulatorComponentSlice.actions;

export default regulatorComponentSlice.reducer;