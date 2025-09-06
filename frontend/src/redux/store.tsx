import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "./baseApi/baseApi";
import cellPvComponentSlice from "@/redux/componentsManageApi/cellPVComponent/cellPVComponentSlice";
import inverterComponentSlice from "@/redux/componentsManageApi/inverterComponent/inverterComponentSlice";
import regulatorComponentSlice from "@/redux/componentsManageApi/regulatorComponent/regulatorComponentSlice";
import projectSlice from "@/redux/projectApi/projectSlice";
import mapSlice from "@/redux/map/mapSlice";

const store = configureStore({
  reducer: {
    // ajout du RTK Query "API slice" pour la mise en cache des données
    [baseApi.reducerPath]: baseApi.reducer,
    // ajouter les autres slices de votre application ici
    cellPvComponent: cellPvComponentSlice,
    inverterComponent: inverterComponentSlice,
    regulatorComponent: regulatorComponentSlice,
    project: projectSlice,
    map: mapSlice,
  },
  // ajouter le RTK Query API middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // désactiver la vérification de sérialisation pour les actions et les états
    }).concat(baseApi.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
