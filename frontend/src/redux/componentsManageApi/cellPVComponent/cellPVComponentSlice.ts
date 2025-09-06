// src/redux/componentsManageApi/cellPVComponent/cellPVComponentSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cellPVComponentApi from "./cellPVComponentApi";

//
import { type TableData } from "@/components_manage/cellPVComponent/columns";

interface CellPvState {
  items: TableData[];
}

const initialState: CellPvState = {
  items: [],
};

const cellPvComponentSlice = createSlice({
  name: "cellPvComponent",
  initialState,
  reducers: {
    // si je veux des reducers manuels (optionel)
  },
  extraReducers: (builder) => {
    // ✅ Connecter le slice avec RTK Query

    // getAll
    builder.addMatcher(
      cellPVComponentApi.endpoints.getAllCellPvComponentByOwner.matchFulfilled,
      (state, { payload }) => {
        state.items = payload.data; // payload = liste renvoyée par l'API
      }
    );

     // getOne
    // builder.addMatcher(
    //   cellPVComponentApi.endpoints.getCellPvComponent.matchFulfilled,
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
      cellPVComponentApi.endpoints.createCellPvComponent.matchFulfilled,
      (state, { payload }) => {
        state.items.push(payload.data);
      }
    );

        // update
    builder.addMatcher(
      cellPVComponentApi.endpoints.updateCellPvComponent.matchFulfilled,
      (state, { payload }) => {
        const index = state.items.findIndex((c) => c.id === payload.data.id);
        if (index >= 0) {
          state.items[index] = payload.data;
        }
      }
    );

    // delete
    builder.addMatcher(
      cellPVComponentApi.endpoints.deleteCellPvComponent.matchFulfilled,
      (state, { meta }) => {
        const id = meta.arg.originalArgs as string;
        state.items = state.items.filter((c) => c.id !== id);
      }
    );

  },
});

export const {  } = cellPvComponentSlice.actions;

export default cellPvComponentSlice.reducer;