import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useGetOrdersQuery } from "../services/api/orderApi";
import { RootState } from "../services/store";
import { Package, Calendar, Tag } from "lucide-react-native";
import { ScreenHeader } from "../components/ScreenHeader";

export default function OrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading } = useGetOrdersQuery();
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

  const orderList = orders?.orders || [];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="My Orders" />

      <FlatList
        data={orderList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="p-6 pt-8 pb-32"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-accent dark:bg-dark-accent p-6 rounded-[32px] mb-6 shadow-sm border border-border dark:border-dark-border"
            activeOpacity={0.8}
            onPress={() => router.push(`/orders/${item.id}`)}
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-xl bg-white/50 dark:bg-black/20 items-center justify-center">
                  <Package size={16} color={isDark ? "#ffffff" : "#111827"} />
                </View>
                <Text className="ml-3 text-[10px] font-black text-primary dark:text-dark-primary uppercase tracking-widest">
                  Order #{item.id.toString().slice(-4)}
                </Text>
              </View>
              <View className="bg-primary dark:bg-dark-primary px-3 py-1 rounded-full">
                <Text className="text-[10px] font-black text-primary-foreground dark:text-dark-secondary uppercase">
                  {item.status}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="flex-row items-center mr-6">
                <Calendar size={14} color={isDark ? "#9ca3af" : "#94a3b8"} />
                <Text className="ml-2 text-xs text-muted dark:text-dark-muted font-bold">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Tag size={14} color={isDark ? "#9ca3af" : "#94a3b8"} />
                <Text className="ml-2 text-xs text-muted dark:text-dark-muted font-bold">
                  ${item.totalPrice}
                </Text>
              </View>
            </View>

            <Text className="text-primary dark:text-dark-primary text-[10px] font-black uppercase tracking-[2px] underline">
              View Receipt
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-24">
            <View className="w-20 h-20 bg-secondary dark:bg-dark-secondary rounded-full items-center justify-center mb-6">
              <Package size={32} color={isDark ? "#374151" : "#e2e8f0"} />
            </View>
            <Text className="text-muted dark:text-dark-muted text-base font-bold text-center">
              No orders yet
            </Text>
            <TouchableOpacity
              className="mt-6"
              onPress={() => router.replace("/")}
            >
              <Text className="text-primary dark:text-dark-primary font-black uppercase tracking-widest text-xs underline">
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
