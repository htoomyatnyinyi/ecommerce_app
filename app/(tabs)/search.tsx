import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { useGetProductsQuery } from "../../services/api/productApi";
import { RootState } from "../../services/store";
import { Heart, Search as SearchIcon, X } from "lucide-react-native";
import { Input } from "../../components/Input";
import { toggleWishlist } from "../../services/wishlistSlice";

export default function SearchScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: products, isLoading } = useGetProductsQuery(null);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const productsData = useMemo(() => {
    const list = Array.isArray(products)
      ? products
      : products?.data ?? products?.products ?? [];

    if (!searchQuery) return list;

    return list.filter(
      (item: any) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.categoryName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item.id === productId);

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

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-6 py-6 bg-background dark:bg-dark-background border-b border-border dark:border-dark-border">
        <Text className="text-[10px] text-muted dark:text-dark-muted font-bold uppercase tracking-[3px] mb-1">
          Explore
        </Text>
        <Text className="text-3xl font-black text-primary dark:text-dark-primary tracking-tighter mb-6">
          Search
        </Text>

        <View className="relative">
          <Input
            label=""
            placeholder="Search products, categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="pl-12"
          />
          <View className="absolute top-7 left-4">
            <SearchIcon size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
          </View>
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="absolute top-7 right-4"
            >
              <X size={20} color={isDark ? "#9ca3af" : "#6b7280"} />
            </TouchableOpacity>
          )}
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
            className="flex-1 m-2"
            activeOpacity={0.9}
            onPress={() => router.push(`/(product)/${item.id}`)}
          >
            <View className="relative bg-secondary dark:bg-dark-secondary rounded-[32px] overflow-hidden aspect-4/5 mb-4 shadow-sm border border-border/50 dark:border-dark-border/50">
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
                onPress={(e) => {
                  e.stopPropagation();
                  dispatch(
                    toggleWishlist({
                      id: item.id.toString(),
                      title: item.title,
                      price: item.variants?.[0]?.price || 0,
                      image: item.images?.[0]?.url || "",
                      category: item.category?.categoryName || "Essentials",
                    })
                  );
                }}
                className={`absolute top-4 right-4 w-10 h-10 ${
                  isInWishlist(item.id.toString())
                    ? "bg-primary"
                    : "bg-white/80 dark:bg-black/40"
                } rounded-full items-center justify-center backdrop-blur-md`}
                activeOpacity={0.8}
              >
                <Heart
                  size={16}
                  color={
                    isInWishlist(item.id.toString())
                      ? "#ffffff"
                      : isDark
                      ? "#ffffff"
                      : "#111827"
                  }
                  fill={
                    isInWishlist(item.id.toString()) ? "#ffffff" : "transparent"
                  }
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            </View>

            <View className="px-2">
              <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[2px] mb-1">
                {item.category?.categoryName || "Essentials"}
              </Text>
              <Text
                className="text-sm font-bold text-primary dark:text-dark-primary mb-1 tracking-tight"
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <Text className="text-base font-black text-primary dark:text-dark-primary">
                ${item.variants?.[0]?.price}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-24">
            <View className="w-20 h-20 bg-secondary dark:bg-dark-secondary rounded-full items-center justify-center mb-6">
              <SearchIcon size={32} color={isDark ? "#374151" : "#e2e8f0"} />
            </View>
            <Text className="text-muted dark:text-dark-muted text-base font-bold text-center">
              {searchQuery ? "No results found" : "Start searching..."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
