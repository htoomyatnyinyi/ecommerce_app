import baseApi from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/api/products",
      providesTags: ["Product"],
      transformResponse: (response: any) => response.data,
    }),
    getProductById: builder.query({
      query: (id) => `/api/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
