import { useAuthMeQuery } from "@/services/api/authApi";
import { useGetProductsQuery } from "@/services/api/productApi";
import { useRouter } from "expo-router";
import { Heart, Search, ShoppingBag } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Products() {
  const {
    data: user,
    isError: authError,
    isLoading: isAuthLoading,
  } = useAuthMeQuery(null);

  const { data: products, isLoading: isProductsLoading } =
    useGetProductsQuery(null);

  const router = useRouter();

  useEffect(() => {
    if (authError) {
      router.replace("/login");
    }
  }, [authError]);

  if (isAuthLoading || isProductsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  // normalize possible API shapes: array, { data: [...] }, { products: [...] }
  const productsData = Array.isArray(products)
    ? products
    : products?.data ?? products?.products ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      {/* Minimalist Header */}
      <View className="px-6 py-6 flex-row justify-between items-end bg-background">
        <View>
          <Text className="text-[10px] text-muted font-bold uppercase tracking-[3px] mb-1">
            Discover
          </Text>
          <Text className="text-3xl font-black text-primary tracking-tighter">
            Collections
          </Text>
        </View>
        <View className="flex-row gap-4 mb-1">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center bg-accent rounded-full"
            activeOpacity={0.7}
          >
            <Search size={22} color="#111827" strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            className="w-10 h-10 items-center justify-center bg-accent rounded-full"
            activeOpacity={0.7}
          >
            <View className="relative">
              <ShoppingBag size={22} color="#111827" strokeWidth={1.5} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={productsData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="p-5 pb-24"
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-1 m-2.5"
            activeOpacity={0.9}
            onPress={() => router.push(`/(product)/${item.id}`)}
          >
            <View className="relative bg-secondary rounded-3xl overflow-hidden aspect-4/5 mb-3 shadow-sm">
              <Image
                source={{
                  uri:
                    item.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <TouchableOpacity
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full items-center justify-center backdrop-blur-md"
                activeOpacity={0.8}
              >
                <Heart size={18} color="#111827" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>

            <View className="px-1">
              <Text className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">
                {item.brand?.name || "Essentials"}
              </Text>
              <Text
                className="text-sm font-bold text-primary mb-1"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text className="text-base font-black text-primary">
                ${item.price}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-24">
            <Text className="text-muted text-base font-medium">
              Coming soon
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
