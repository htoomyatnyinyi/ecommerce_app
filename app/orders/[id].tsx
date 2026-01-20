import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useGetOrderByIdQuery } from "../../services/api/orderApi";
import { RootState } from "../../services/store";
import {
  ChevronLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
} from "lucide-react-native";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: orderData, isLoading } = useGetOrderByIdQuery(id as string);

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

  const order = orderData?.data;

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background">
        <Text className="text-muted dark:text-dark-muted font-bold">
          Order not found
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary dark:text-dark-primary underline uppercase text-xs font-black tracking-widest">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return <Clock size={20} color="#3b82f6" />;
      case "SHIPPED":
        return <Truck size={20} color="#8b5cf6" />;
      case "DELIVERED":
        return <CheckCircle2 size={20} color="#22c55e" />;
      default:
        return <Clock size={20} color="#94a3b8" />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View className="px-6 py-6 flex-row items-center justify-between border-b border-border dark:border-dark-border">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-secondary dark:bg-dark-secondary rounded-2xl items-center justify-center"
          >
            <ChevronLeft size={24} color={isDark ? "#ffffff" : "#111827"} />
          </TouchableOpacity>
          <Text className="ml-4 text-xl font-black text-primary dark:text-dark-primary tracking-tighter">
            Order Details
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View className="bg-accent dark:bg-dark-accent p-6 rounded-[32px] mb-8 flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[3px] mb-1">
              Order Status
            </Text>
            <Text className="text-primary dark:text-dark-primary font-black text-lg">
              {order.status}
            </Text>
          </View>
          <View className="w-12 h-12 bg-white/50 dark:bg-black/20 rounded-2xl items-center justify-center">
            {getStatusIcon(order.status)}
          </View>
        </View>

        {/* Items Section */}
        <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[3px] mb-6 ml-2">
          Items Ordered
        </Text>

        {order.items.map((item: any, index: number) => (
          <View
            key={index}
            className="flex-row items-center mb-6 bg-secondary/30 dark:bg-dark-secondary/20 p-4 rounded-3xl border border-border/50 dark:border-dark-border/50"
          >
            <View className="w-20 h-24 bg-secondary dark:bg-dark-secondary rounded-2xl overflow-hidden">
              <Image
                source={{
                  uri:
                    item.product?.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 ml-4 justify-center">
              <Text className="text-primary dark:text-dark-primary font-bold text-sm mb-1 uppercase tracking-tight">
                {item.product?.name || item.product?.title}
              </Text>
              <Text className="text-muted dark:text-dark-muted text-xs font-medium mb-2 italic">
                {item.variant?.color} / {item.variant?.size} • Qty:{" "}
                {item.quantity}
              </Text>
              <Text className="text-primary dark:text-dark-primary font-black">
                ${item.price}
              </Text>
            </View>
          </View>
        ))}

        {/* Shipping & Payment Grids */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-accent dark:bg-dark-accent p-5 rounded-[32px]">
            <View className="w-8 h-8 rounded-xl bg-white/50 dark:bg-black/20 items-center justify-center mb-4">
              <MapPin size={16} color={isDark ? "#ffffff" : "#111827"} />
            </View>
            <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-widest mb-2">
              Shipping
            </Text>
            <Text className="text-primary dark:text-dark-primary text-[10px] font-bold leading-4">
              {order.shippingAddress?.addressLine1 || "Standard Delivery"}
            </Text>
          </View>

          <View className="flex-1 bg-accent dark:bg-dark-accent p-5 rounded-[32px]">
            <View className="w-8 h-8 rounded-xl bg-white/50 dark:bg-black/20 items-center justify-center mb-4">
              <CreditCard size={16} color={isDark ? "#ffffff" : "#111827"} />
            </View>
            <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-widest mb-2">
              Payment
            </Text>
            <Text className="text-primary dark:text-dark-primary text-[10px] font-bold">
              {order.payment?.paymentMethod || "Visa Card"}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View className="bg-primary dark:bg-dark-primary p-8 rounded-[40px] mb-20 shadow-xl shadow-slate-900/10">
          <View className="flex-row justify-between mb-4 border-b border-white/10 dark:border-black/10 pb-4">
            <Text className="text-white/60 dark:text-dark-secondary/60 text-[10px] font-black uppercase tracking-[2px]">
              Subtotal
            </Text>
            <Text className="text-white dark:text-dark-secondary font-black">
              ${order.totalPrice}
            </Text>
          </View>
          <View className="flex-row justify-between mb-4 border-b border-white/10 dark:border-black/10 pb-4">
            <Text className="text-white/60 dark:text-dark-secondary/60 text-[10px] font-black uppercase tracking-[2px]">
              Delivery
            </Text>
            <Text className="text-white dark:text-dark-secondary font-black">
              Free
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-white dark:text-dark-secondary text-lg font-black uppercase tracking-tighter">
              Total
            </Text>
            <Text className="text-white dark:text-dark-secondary text-2xl font-black tracking-tighter">
              ${order.totalPrice}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
