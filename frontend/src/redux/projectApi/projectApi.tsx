import { baseApi } from "../baseApi/baseApi";
import { setHeaders } from "../baseApi/baseApiPath";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (payload: any) => ({
        url: `/api/project/create`,
        method: "POST",
        body: payload,
      }),
    }),
    getProject: builder.query({
      query: (id: string) => ({
        url: `/api/project/get/${id}`,
        method: "GET",
      }),
    }),
    updateProject: builder.mutation({
      query: (payload: any) => ({
        url: `/api/project/update/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    uploadProjectProfil: builder.mutation({
      query: (payload: any) => ({
        url: "/api/uploads/project_profile",
        method: "POST",
        formData: true,
        body: payload,
      }),
    }),
    deleteProject: builder.mutation({
      query: (id: string) => ({
        url: `/api/project/delete/${id}`,
        method: "DELETE",
      }),
    }),
    getAllProjectByOwner: builder.query({
      query: () => ({
        url: `/api/project/getAllByOwner`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectQuery,
  useGetAllProjectByOwnerQuery,
  useLazyGetAllProjectByOwnerQuery,
  useLazyGetProjectQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUploadProjectProfilMutation,
} = projectApi;

export default projectApi;
