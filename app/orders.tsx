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
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useGetOrdersQuery } from "../services/api/orderApi";
import { RootState } from "../services/store";
import { ChevronLeft, Package, Calendar, Tag } from "lucide-react-native";

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

  const orderList = Array.isArray(orders) ? orders : orders?.data || [];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-6 py-6 flex-row items-center border-b border-border dark:border-dark-border">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-secondary dark:bg-dark-secondary rounded-2xl items-center justify-center"
        >
          <ChevronLeft size={24} color={isDark ? "#ffffff" : "#111827"} />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-black text-primary dark:text-dark-primary tracking-tighter">
          My Orders
        </Text>
      </View>

      <FlatList
        data={orderList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="p-6 pt-8 pb-32"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-accent dark:bg-dark-accent p-6 rounded-[32px] mb-6 shadow-sm border border-border dark:border-dark-border">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-xl bg-white/50 dark:bg-black/20 items-center justify-center">
                  <Package size={16} color={isDark ? "#ffffff" : "#111827"} />
                </View>
                <Text className="ml-3 text-xs font-black text-primary dark:text-dark-primary uppercase tracking-widest">
                  Order #{item.id.toString().slice(-4)}
                </Text>
              </View>
              <View className="bg-primary dark:bg-dark-primary px-3 py-1 rounded-full">
                <Text className="text-[10px] font-black text-primary-foreground dark:text-dark-secondary uppercase">
                  {item.status}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-6">
              <View className="flex-row items-center mr-6">
                <Calendar size={14} color={isDark ? "#9ca3af" : "#94a3b8"} />
                <Text className="ml-2 text-xs text-muted dark:text-dark-muted font-bold">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Tag size={14} color={isDark ? "#9ca3af" : "#94a3b8"} />
                <Text className="ml-2 text-xs text-muted dark:text-dark-muted font-bold">
                  ${item.totalAmount}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="bg-primary dark:bg-dark-primary py-4 rounded-2xl items-center"
              activeOpacity={0.9}
            >
              <Text className="text-primary-foreground dark:text-dark-secondary text-[10px] font-black uppercase tracking-[2px]">
                View Details
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-24">
            <View className="w-20 h-20 bg-secondary dark:bg-dark-secondary rounded-full items-center justify-center mb-6">
              <Package size={32} color={isDark ? "#374151" : "#e2e8f0"} />
            </View>
            <Text className="text-muted dark:text-dark-muted text-base font-bold text-center">
              No orders yet
            </Text>
            <TouchableOpacity className="mt-6" onPress={() => router.push("/")}>
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
