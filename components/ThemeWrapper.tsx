import React from "react";
import { Stack } from "expo-router";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, RootState } from "@/services/store";
import { StripeProvider } from "@stripe/stripe-react-native";
import { View } from "react-native";
import "../global.css";

// This component handles the theme WITHOUT wrapping the Stack in a way that breaks context
function StyledStack() {
  const mode = useSelector((state: RootState) => state.theme.mode);

  return (
    <View className={`flex-1 ${mode === "dark" ? "dark bg-black" : "bg-white"}`}>
      <Stack
        screenOptions={{
          headerShown: false,
          // This ensures the actual screen background matches your theme
          contentStyle: { backgroundColor: mode === "dark" ? "#000" : "#fff" },
        }}
      >
        <Stack.Screen name="index" /> 
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StripeProvider
          publishableKey="pk_test_51SpOXN5a8dgiY5gLfgQ4an5yy9cdKOqtgF4zwC9vnUw9Ad5GVYRCDuKcbqais5g3Y7q4pIlMJLiOA7zan0ZTylOW00eePk1npo"
          merchantIdentifier="merchant.com.shopio"
        >
          <StyledStack />
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
}


// import React from "react";
// import { View } from "react-native";
// import { useSelector } from "react-redux";
// import { RootState } from "../services/store";

// export function ThemeWrapper({ children }: { children: React.ReactNode }) {
//   const mode = useSelector((state: RootState) => state.theme.mode);

//   return (
//     <View
//       className={`flex-1 ${mode === "dark" ? "dark bg-black" : "bg-white"}`}
//     >
//       {children}
//     </View>
//   );
// }
