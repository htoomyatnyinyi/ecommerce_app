import baseApi from "./baseApi";

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStripeConfig: builder.query({
      query: () => "/api/checkout/config",
    }),
    createPaymentIntent: builder.mutation({
      query: (body) => ({
        url: "/api/checkout/create-payment-intent",
        method: "POST",
        body,
      }),
    }),
    confirmPayment: builder.mutation({
      query: (body) => ({
        url: "/api/checkout/confirm-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Order"],
    }),
  }),
});

export const {
  useGetStripeConfigQuery,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} = checkoutApi;
