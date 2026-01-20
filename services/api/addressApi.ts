import baseApi from "./baseApi";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<any, void>({
      query: () => "/api/address",
      transformResponse: (response: any) => response.data,
      providesTags: ["Address", "Order"],
    }),
    createAddress: builder.mutation<any, any>({
      query: (body) => ({
        url: "/api/address",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["Address", "Order"],
    }),
    updateAddress: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/api/address/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["Address", "Order"],
    }),
    deleteAddress: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/address/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["Address", "Order"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
