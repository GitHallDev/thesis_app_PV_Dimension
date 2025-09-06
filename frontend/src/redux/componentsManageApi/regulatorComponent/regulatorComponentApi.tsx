import { baseApi } from "../../baseApi/baseApi";

const regulatorComponentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRegulatorComponent: builder.mutation({
      query: (payload: any) => ({
        url: `/api/regulateur/create`,
        method: "POST",
        body: payload,
      }),
    }),
    getRegulatorComponent: builder.query({
      query: (id: string) => ({
        url: `/api/regulateur/get/${id}`,
        method: "GET",
      }),
    }),
    updateRegulatorComponent: builder.mutation({
      query: (payload: any) => ({
        url: `/api/regulateur/update/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    deleteRegulatorComponent: builder.mutation({
      query: (id: string) => ({
        url: `/api/regulateur/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getAllRegulatorComponentByOwner: builder.query({
      query: () => ({
        url: `/api/regulateur/getAllByOwner`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateRegulatorComponentMutation,
  useGetRegulatorComponentQuery,
  useGetAllRegulatorComponentByOwnerQuery,
  useLazyGetAllRegulatorComponentByOwnerQuery,
  useLazyGetRegulatorComponentQuery,
  useUpdateRegulatorComponentMutation,
  useDeleteRegulatorComponentMutation,
} = regulatorComponentApi;

export default regulatorComponentApi;
