import baseApi from "./baseApi";

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStripeConfig: builder.query({
      query: () => "/api/checkout/config",
      transformResponse: (response: any) => response.data,
    }),
    createPaymentIntent: builder.mutation({
      query: (body) => ({
        url: "/api/checkout/create-payment-intent",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response.data,
    }),
    confirmPayment: builder.mutation({
      query: (body) => ({
        url: "/api/checkout/confirm-payment",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["Cart", "Order"],
    }),
  }),
});

export const {
  useGetStripeConfigQuery,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} = checkoutApi;
