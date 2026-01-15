import { useRouter } from "expo-router";
import {
  ChevronRight,
  CreditCard,
  LogOut,
  MapPin,
  Package,
  Settings,
} from "lucide-react-native";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useAuthMeQuery, useSignOutMutation } from "../../services/api/authApi";
import { RootState } from "../../services/store";

export default function ProfileScreen() {
  const { data: user } = useAuthMeQuery(null);
  const [signOut] = useSignOutMutation();
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const menuItems = [
    { icon: Package, label: "My Orders", route: "/orders" },
    { icon: MapPin, label: "Shipping Address", route: "/addresses" },
    { icon: CreditCard, label: "Payment Methods", route: "/payment-methods" },
    { icon: Settings, label: "Settings", route: "/settings" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="items-center py-12">
          <View className="w-24 h-24 bg-secondary dark:bg-dark-secondary rounded-full items-center justify-center mb-4 border-4 border-accent dark:border-dark-accent overflow-hidden shadow-sm">
            <Image
              source={{
                uri:
                  "https://ui-avatars.com/api/?name=" +
                  (user?.username || "G") +
                  "&background=" +
                  (isDark ? "ffffff&color=000" : "111827&color=fff"),
              }}
              className="w-full h-full"
            />
          </View>
          <Text className="text-2xl font-black text-primary dark:text-dark-primary tracking-tighter">
            {user?.username || "Guest User"}
          </Text>
          <Text className="text-muted dark:text-dark-muted font-medium mt-1">
            {user?.email || "Login to see your info"}
          </Text>
        </View>

        <View className="gap-4">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center bg-accent dark:bg-dark-accent p-5 rounded-3xl"
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-2xl items-center justify-center bg-white/50 dark:bg-black/20">
                <item.icon
                  size={20}
                  color={isDark ? "#ffffff" : "#64748b"}
                  strokeWidth={1.5}
                />
              </View>
              <Text className="flex-1 ml-4 text-primary dark:text-dark-primary font-bold">
                {item.label}
              </Text>
              <ChevronRight size={18} color={isDark ? "#9ca3af" : "#94a3b8"} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="mt-12 mb-10 flex-row items-center justify-center bg-secondary dark:bg-dark-secondary p-5 rounded-3xl border border-border dark:border-dark-border"
          activeOpacity={0.8}
          onPress={async () => {
            await signOut().unwrap();
            router.replace("/login");
          }}
        >
          <LogOut
            size={20}
            color={isDark ? "#ffffff" : "#111827"}
            strokeWidth={1.5}
          />
          <Text className="ml-3 text-primary dark:text-dark-primary font-black uppercase tracking-widest text-xs">
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
