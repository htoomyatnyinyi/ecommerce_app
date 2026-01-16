import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSelector } from "react-redux";
import {
  useGetAddressesQuery,
  useDeleteAddressMutation,
} from "../services/api/addressApi";
import { RootState } from "../services/store";
import { MapPin, Plus, Trash2, Home, Briefcase } from "lucide-react-native";
import { ScreenHeader } from "../components/ScreenHeader";

import { useRouter } from "expo-router";

export default function AddressesScreen() {
  const router = useRouter();
  const { data: addresses, isLoading } = useGetAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background">
        <ActivityIndicator
          size="large"
          color={isDark ? "#ffffff" : "#111827"}
        />
      </View>
    );
  }

  const addressList = Array.isArray(addresses)
    ? addresses
    : addresses?.data || [];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScreenHeader
        title="Addresses"
        rightElement={
          <TouchableOpacity
            onPress={() => router.push("/add-address")}
            className="w-10 h-10 bg-primary dark:bg-dark-primary rounded-2xl items-center justify-center shadow-lg"
            activeOpacity={0.8}
          >
            <Plus size={20} color={isDark ? "#000000" : "#ffffff"} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={addressList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="p-6 pt-8 pb-32"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-accent dark:bg-dark-accent p-6 rounded-[32px] mb-6 border border-border dark:border-dark-border">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-2xl bg-white/50 dark:bg-black/20 items-center justify-center">
                  {item.label?.toLowerCase() === "home" ? (
                    <Home
                      size={20}
                      color={isDark ? "#ffffff" : "#111827"}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Briefcase
                      size={20}
                      color={isDark ? "#ffffff" : "#111827"}
                      strokeWidth={1.5}
                    />
                  )}
                </View>
                <View className="ml-4">
                  <Text className="text-primary dark:text-dark-primary font-black uppercase tracking-widest text-[10px]">
                    {item.label || "Shipping"}
                  </Text>
                  {item.isDefault && (
                    <Text className="text-muted dark:text-dark-muted text-[10px] font-bold mt-0.5">
                      Default Address
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => deleteAddress(item.id)}
                className="p-2"
              >
                <Trash2 size={18} color="#ef4444" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>

            <Text className="text-primary dark:text-dark-primary font-bold text-sm leading-6 mb-2">
              {item.street}
            </Text>
            <Text className="text-muted dark:text-dark-muted font-bold text-xs">
              {item.city}, {item.state} {item.postalCode}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-24">
            <View className="w-20 h-20 bg-secondary dark:bg-dark-secondary rounded-full items-center justify-center mb-6">
              <MapPin size={32} color={isDark ? "#374151" : "#e2e8f0"} />
            </View>
            <Text className="text-muted dark:text-dark-muted text-base font-bold text-center">
              No saved addresses
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
