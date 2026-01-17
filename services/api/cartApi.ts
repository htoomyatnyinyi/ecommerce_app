import baseApi from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/api/cart",
      providesTags: ["Cart"],
      // transformResponse: (response: any) => response.data,
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
      async onQueryStarted(
        { cartItemId, quantity },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const cartItems = draft.getCart?.cartItems || [];
            const item = cartItems.find((i: any) => i.id === cartItemId);
            if (item) {
              item.quantity = quantity;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (body) => ({
        url: "/api/cart",
        method: "DELETE",
        body,
      }),
      async onQueryStarted({ removeCartItemId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            if (draft.getCart?.cartItems) {
              draft.getCart.cartItems = draft.getCart.cartItems.filter(
                (item: any) => item.id !== removeCartItemId
              );
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
