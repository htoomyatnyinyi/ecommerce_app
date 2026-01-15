import baseApi from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/api/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (body) => ({
        url: "/api/cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartQuantity: builder.mutation({
      query: (body) => ({
        url: "/api/cart/quantity",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (body) => ({
        url: "/api/cart",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
} = cartApi;
