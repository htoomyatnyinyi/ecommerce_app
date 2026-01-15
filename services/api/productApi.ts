import baseApi from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/api/products",
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/api/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
