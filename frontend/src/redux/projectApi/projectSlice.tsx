// src/redux/componentsManageApi/regulatorComponent/regulatorComponentSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import projectApi from "./projectApi";

//
import { type TableData } from "@/projects/columns";

interface ProjectState {
  items: TableData[];
}

const initialState: ProjectState = {
  items: [],
};

const projectSlice = createSlice({
  name: "projectComponent",
  initialState,
  reducers: {
    // si je veux des reducers manuels (optionel)
  },
  extraReducers: (builder) => {
    // ✅ Connecter le slice avec RTK Query

    // getAll
    builder.addMatcher(
      projectApi.endpoints.getAllProjectByOwner.matchFulfilled,
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
      projectApi.endpoints.createProject.matchFulfilled,
      (state, { payload }) => {
        state.items.push(payload.data);
      }
    );

    // update
    builder.addMatcher(
      projectApi.endpoints.updateProject.matchFulfilled,
      (state, { payload }) => {
        const index = state.items.findIndex((c) => c.id === payload.data.id);
        if (index >= 0) {
          state.items[index] = payload.data;
        }
      }
    );

    // delete
    builder.addMatcher(
      projectApi.endpoints.deleteProject.matchFulfilled,
      (state, { meta }) => {
        const id = meta.arg.originalArgs as string;
        state.items = state.items.filter((c) => c.id !== id);
      }
    );
  },
});

export const {} = projectSlice.actions;

export default projectSlice.reducer;
