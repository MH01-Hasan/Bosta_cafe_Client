import { IBranch, IMeta } from "@/types";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const BRANCH_CREAT_URL = "/auth/registration";

const ALL_BRANCH_URL ="/branch"

export const branchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    branchs: build.query({
      query: (arg: Record<string, any>) => ({
        url: ALL_BRANCH_URL,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response:IBranch, meta: IMeta) => {
        return {
         branchs: response,
          meta,
        };
      },
      providesTags: [tagTypes.branch],
    }),

//.....................CREAT NEW BRANCH .......................
    CreatBranch: build.mutation({
        query: (data) => ({
          url: BRANCH_CREAT_URL,
          method: "POST",
          data,
        }),
        invalidatesTags: [tagTypes.branch],
      }),
    
   

    // get single department by id
    branch: build.query({
      query: (id) => ({
        url: `${ALL_BRANCH_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.branch],
    }),

    // update single department by id
    updateBranch: build.mutation({
      query: (data) => ({
        url: `${ALL_BRANCH_URL}/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.branch],
    }),

    // delete single department by id
    deleteBranch: build.mutation({
      query: (id) => ({
        url: `${ALL_BRANCH_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.branch],
    }),
  }),
});

export const {
    useBranchsQuery,
    useBranchQuery,
    useCreatBranchMutation,
    useDeleteBranchMutation,
    useUpdateBranchMutation
  
} = branchApi;
