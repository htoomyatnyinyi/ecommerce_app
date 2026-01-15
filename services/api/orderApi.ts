import baseApi from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<any, void>({
      query: () => "/api/order",
      providesTags: ["Order"],
    }),
    getOrderById: builder.query<any, string>({
      query: (id) => `/api/order/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery } = orderApi;
