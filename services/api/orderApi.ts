import baseApi from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<any, void>({
      query: () => "/api/order",
      providesTags: ["Order"],
      transformResponse: (response: any) => response.data,
    }),
    getOrderById: builder.query<any, string>({
      query: (id) => `/api/order/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery } = orderApi;
