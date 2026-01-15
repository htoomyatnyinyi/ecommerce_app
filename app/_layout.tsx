import { Stack } from "expo-router";
// import { Provider } from "react-redux";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Provider } from "react-redux";
import "../global.css";
import { store } from "../services/store";

import { ThemeWrapper } from "../components/ThemeWrapper";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeWrapper>
        <StripeProvider
          publishableKey="pk_test_51SpOXN5a8dgiY5gLfgQ4an5yy9cdKOqtgF4zwC9vnUw9Ad5GVYRCDuKcbqais5g3Y7q4pIlMJLiOA7zan0ZTylOW00eePk1npo"
          merchantIdentifier="merchant.com.shopio"
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="(product)/[id]" />
            <Stack.Screen name="checkout" options={{ presentation: "modal" }} />
          </Stack>
        </StripeProvider>
      </ThemeWrapper>
    </Provider>
  );
}
