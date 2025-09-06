import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {setHeaders } from "./baseApiPath";
import {api_path}from "../../environement";


export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: api_path,
    mode: "cors",
    credentials: "include",
    // headers:{ 'content-type': 'application/json' },
    prepareHeaders: setHeaders,
  }),
  // keepUnusedDataFor: 30, // 30 s durée de mise en cache des données non utilisées 
  // tagTypes:['InfoType'],
  endpoints: () => ({}),
});
