import { Stack, useRouter, useSegments } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Provider, useSelector } from "react-redux";
import React, { useEffect } from "react";
import "../global.css";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, RootState } from "../services/store";

import { ThemeWrapper } from "../components/ThemeWrapper";

import { useAuthMeQuery } from "../services/api/authApi";

function InitialRouteHandler({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const {
    data: user,
    isLoading: isAuthLoading,
    isError: authError,
  } = useAuthMeQuery(null);

  const hasSeenOnboarding = useSelector(
    (state: RootState) => state.settings.hasSeenOnboarding
  );

  useEffect(() => {
    if (isAuthLoading) return;

    const inAuthGroup = segments[0] === "signin" || segments[0] === "signup";
    const inOnboarding = segments[0] === "onboarding";
    const inVerifyEmail = segments[0] === "verify-email";

    const isProtectedRoute =
      segments[0] === "(tabs)" ||
      segments[0] === "(product)" ||
      segments[0] === "checkout";

    // 1. Onboarding Protection
    if (!hasSeenOnboarding && !inOnboarding) {
      router.replace("/onboarding");
      return;
    }

    // 2. Auth Protection for Tabs/Products
    if (isProtectedRoute && authError) {
      router.replace("/signin");
      return;
    }

    // 3. Email Verification Protection
    if (
      user &&
      !authError &&
      !user.isEmailVerified &&
      !inVerifyEmail &&
      isProtectedRoute
    ) {
      router.replace("/verify-email");
      return;
    }

    // 4. Redirect Authenticated users away from Auth screens
    if (user && !authError && user.isEmailVerified && inAuthGroup) {
      router.replace("/(tabs)/products");
    }
  }, [hasSeenOnboarding, segments, user, authError, isAuthLoading]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeWrapper>
          <InitialRouteHandler>
            <StripeProvider
              publishableKey="pk_test_51SpOXN5a8dgiY5gLfgQ4an5yy9cdKOqtgF4zwC9vnUw9Ad5GVYRCDuKcbqais5g3Y7q4pIlMJLiOA7zan0ZTylOW00eePk1npo"
              merchantIdentifier="merchant.com.shopio"
            >
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="signin" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="verify-email" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(product)/[id]" />
                <Stack.Screen
                  name="checkout"
                  options={{ presentation: "modal" }}
                />
              </Stack>
            </StripeProvider>
          </InitialRouteHandler>
        </ThemeWrapper>
      </PersistGate>
    </Provider>
  );
}
