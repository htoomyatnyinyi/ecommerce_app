import { Tabs } from "expo-router";
import { Home, ShoppingBag, User, Heart } from "lucide-react-native";
import { Platform } from "react-native";

import { useSelector } from "react-redux";
import { RootState } from "../../services/store";

export default function TabLayout() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#ffffff" : "#111827",
        tabBarInactiveTintColor: isDark ? "#4b5563" : "#9ca3af",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 72,
          paddingBottom: Platform.OS === "ios" ? 32 : 16,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#1f2937" : "#f3f4f6",
          backgroundColor: isDark ? "#000000" : "#ffffff",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="products"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => (
            <Home size={22} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <Heart size={22} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Bag",
          tabBarIcon: ({ color }) => (
            <ShoppingBag size={22} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User size={22} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
