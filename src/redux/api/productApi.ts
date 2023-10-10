import { ICategory, IMeta, IProduct } from "@/types";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const PRODUCT_URL = "/product";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    products: build.query({
      query: (arg: Record<string, any>) => ({
        url: PRODUCT_URL,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: IProduct, meta: IMeta) => {
        return {
            products: response,
          meta,
        };
      },
      providesTags: [tagTypes.product],
    }),

    addCategory: build.mutation({
      query: (data) => ({
        url: PRODUCT_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    // get single department by id
    product: build.query({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),

    // update single department by id
    updateProduct: build.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    // delete single department by id
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product],
    }),
  }),
});

export const {
 
} = productApi;