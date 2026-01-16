import { useRouter } from "expo-router";
import {
  ChevronRight,
  CreditCard,
  LogOut,
  MapPin,
  Package,
  Settings,
  Heart,
  User,
  ShieldCheck,
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
import { Button } from "../../components/Button";

export default function ProfileScreen() {
  const { data: user } = useAuthMeQuery(null);
  const [signOut] = useSignOutMutation();
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const Sections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit Profile", route: "/edit-profile" },
        { icon: ShieldCheck, label: "Security", route: "/security" },
      ],
    },
    {
      title: "Activity",
      items: [
        { icon: Package, label: "My Orders", route: "/orders" },
        { icon: Heart, label: "My Favorites", route: "/wishlist" },
      ],
    },
    {
      title: "Logistics",
      items: [
        { icon: MapPin, label: "Shipping Address", route: "/addresses" },
        {
          icon: CreditCard,
          label: "Payment Methods",
          route: "/payment-methods",
        },
      ],
    },
    {
      title: "App",
      items: [{ icon: Settings, label: "Settings", route: "/settings" }],
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut().unwrap();
      router.replace("/signin");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Tab Header */}
      <View className="px-6 py-6 border-b border-border dark:border-dark-border">
        <Text className="text-3xl font-black text-primary dark:text-dark-primary tracking-tighter">
          Profile
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="items-center py-12">
          <View className="w-24 h-24 bg-accent dark:bg-dark-accent rounded-full items-center justify-center mb-4 border-4 border-secondary dark:border-dark-secondary overflow-hidden shadow-sm">
            <Image
              source={{
                uri:
                  "https://ui-avatars.com/api/?name=" +
                  (user?.username || "G") +
                  "&background=" +
                  (isDark ? "ffffff&color=000" : "111827&color=fff") +
                  "&size=128",
              }}
              className="w-full h-full"
            />
          </View>
          <Text className="text-2xl font-black text-primary dark:text-dark-primary tracking-tighter">
            {user?.username || "Guest User"}
          </Text>
          <Text className="text-muted dark:text-dark-muted font-bold mt-1 uppercase tracking-widest text-[10px]">
            {user?.email || "Login to access your data"}
          </Text>
        </View>

        {Sections.map((section, sIndex) => (
          <View key={sIndex} className="mb-8">
            <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[3px] mb-4 ml-4">
              {section.title}
            </Text>
            <View className="gap-3">
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center bg-secondary dark:bg-dark-secondary p-5 rounded-[28px] border border-border/50 dark:border-dark-border/50"
                  onPress={() => item.route && router.push(item.route as any)}
                  activeOpacity={0.7}
                >
                  <View className="w-10 h-10 rounded-2xl items-center justify-center bg-accent dark:bg-dark-accent">
                    <item.icon
                      size={20}
                      color={isDark ? "#ffffff" : "#111827"}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Text className="flex-1 ml-4 text-primary dark:text-dark-primary font-bold">
                    {item.label}
                  </Text>
                  <ChevronRight
                    size={18}
                    color={isDark ? "#ffffff" : "#111827"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View className="mt-4 mb-20">
          <Button
            label="Sign Out"
            icon={LogOut}
            variant="secondary"
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
