
import { IMeta, IProduct } from "@/types";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const ORDERS_URL = "/orders";

export const OrdersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    orders: build.query({
      query: (arg: Record<string, any>) => ({
        url: ORDERS_URL,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response:[], meta: IMeta) => {
        return {
          products: response,
          meta,
        };
      },
      providesTags: [tagTypes.orders],
    }),


    addOrders: build.mutation({
      query: (data) => ({
        url: ORDERS_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.orders],
    }),

    // get single department by id
    // product: build.query({
    //   query: (id) => ({
    //     url: `${ORDERS_URL}/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: [tagTypes.product],
    // }),

    // update single department by id
    // updateProduct: build.mutation({
    //   query: (data) => ({
    //     url: `${ORDERS_URL}/${data.id}`,
    //     method: "PATCH",
    //     data: data.body,
    //   }),
    //   invalidatesTags: [tagTypes.product],
    // }),

    // delete single department by id
    // deleteProduct: build.mutation({
    //   query: (id) => ({
    //     url: `${ORDERS_URL}/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: [tagTypes.product],
    // }),
  }),
});

export const {
    useOrdersQuery,
    useAddOrdersMutation,
//   useProductsQuery,
//   useProductQuery,
//   useDeleteProductMutation,
//   useUpdateProductMutation
} = OrdersApi;
