import { baseApi } from "../../baseApi/baseApi";

const inverterComponentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInverterComponent: builder.mutation({
      query: (payload: any) => ({
        url: `/api/onduleur/create`,
        method: "POST",
        body: payload,
      }),
    }),
    getInverterComponent: builder.query({
      query: (id: string) => ({
        url: `/api/onduleur/get/${id}`,
        method: "GET",
      }),
    }),
    updateInverterComponent: builder.mutation({
      query: (payload: any) => ({
        url: `/api/onduleur/update/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    deleteInverterComponent: builder.mutation({
      query: (id: string) => ({
        url: `/api/onduleur/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getAllInverterComponentByOwner: builder.query({
      query: () => ({
        url: `/api/onduleur/getAllByOwner`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateInverterComponentMutation,
  useGetInverterComponentQuery,
  useGetAllInverterComponentByOwnerQuery,
  useLazyGetAllInverterComponentByOwnerQuery,
  useLazyGetInverterComponentQuery,
  useUpdateInverterComponentMutation,
  useDeleteInverterComponentMutation,
} = inverterComponentApi;

export default inverterComponentApi;
