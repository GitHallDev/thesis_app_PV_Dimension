// src/redux/componentsManageApi/inverterComponent/inverterComponentSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import inverterComponentApi from "./inverterComponentApi";

//
import { type TableData } from "@/components_manage/inverterComponent/columns";

interface InverterState {
  items: TableData[];
}

const initialState: InverterState = {
  items: [],
};

const inverterComponentSlice = createSlice({
  name: "inverterComponent",
  initialState,
  reducers: {
    // si je veux des reducers manuels (optionel)
  },
  extraReducers: (builder) => {
    // ✅ Connecter le slice avec RTK Query

    // getAll
    builder.addMatcher(
      inverterComponentApi.endpoints.getAllInverterComponentByOwner.matchFulfilled,
      (state, { payload }) => {
        state.items = payload.data; // payload = liste renvoyée par l'API
      }
    );

     // getOne
    // builder.addMatcher(
    //   inverterComponentApi.endpoints.getInverterComponent.matchFulfilled,
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
      inverterComponentApi.endpoints.createInverterComponent.matchFulfilled,
      (state, { payload }) => {
        state.items.push(payload.data);
      }
    );

        // update
    builder.addMatcher(
      inverterComponentApi.endpoints.updateInverterComponent.matchFulfilled,
      (state, { payload }) => {
        const index = state.items.findIndex((c) => c.id === payload.data.id);
        if (index >= 0) {
          state.items[index] = payload.data;
        }
      }
    );

    // delete
    builder.addMatcher(
      inverterComponentApi.endpoints.deleteInverterComponent.matchFulfilled,
      (state, { meta }) => {
        const id = meta.arg.originalArgs as string;
        state.items = state.items.filter((c) => c.id !== id);
      }
    );

  },
});

export const {  } = inverterComponentSlice.actions;

export default inverterComponentSlice.reducer;