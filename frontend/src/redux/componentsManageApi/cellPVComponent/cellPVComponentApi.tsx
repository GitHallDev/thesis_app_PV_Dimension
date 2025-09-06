import { baseApi } from "../../baseApi/baseApi";

const cellPVComponentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCellPvComponent: builder.mutation({
      query: (payload: any) => ({
        url: `/api/cell-pv/create`,
        method: "POST",
        body: payload,
      }),
    }),
    getCellPvComponent: builder.query({
      query: (id: string) => ({
        url: `/api/cell-pv/get/${id}`,

        method: "GET",
      }),
    }),
    updateCellPvComponent: builder.mutation({
      query: (payload: any) => ({
        url: `/api/cell-pv/update/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    deleteCellPvComponent: builder.mutation({
      query: (id: string) => ({
        url: `/api/cell-pv/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getAllCellPvComponentByOwner: builder.query({
      query: () => ({
        url: `/api/cell-pv/getAllByOwner`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCellPvComponentMutation,
  useGetCellPvComponentQuery,
  useGetAllCellPvComponentByOwnerQuery,
  useLazyGetAllCellPvComponentByOwnerQuery,
  useLazyGetCellPvComponentQuery,
  useUpdateCellPvComponentMutation,
  useDeleteCellPvComponentMutation,
} = cellPVComponentApi;

export default cellPVComponentApi;
