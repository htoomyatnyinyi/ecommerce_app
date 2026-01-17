import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://192.168.1.143:8080"; // <--- UPDATE THIS IP to your server's current local IP
// const BASE_URL = "http://192.168.1.67:8080";
// const BASE_URL = "http://192.168.137.136:8080";
// const BASE_URL = "http://localhost:8080";
const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Product", "Cart", "Order", "Address"],
  endpoints: () => ({}),
});

export default baseApi;
