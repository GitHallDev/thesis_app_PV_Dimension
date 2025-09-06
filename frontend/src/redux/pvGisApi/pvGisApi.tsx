import { baseApi } from "../baseApi/baseApi";

const pvGisApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPvGisData: builder.query({
      query: ({
        latitude,
        longitude,
        startYear,
        endYear,
        angle,
        aspect,
        outputformat,
      }) => ({
        url: `api/pvgis/seriescalc`,
        params: {
          lat: latitude,
          lon: longitude,
          startyear: startYear,
          endyear: endYear,
          angle: angle,
          aspect: aspect,
          outputformat: outputformat,
        },
      }),
    }),
  }),
});

export const { useGetPvGisDataQuery, useLazyGetPvGisDataQuery } = pvGisApi;
