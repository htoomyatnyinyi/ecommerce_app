import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../services/store";
import { toggleWishlist } from "../services/wishlistSlice";
import { Heart, ShoppingBag, Trash2 } from "lucide-react-native";
import { ScreenHeader } from "../components/ScreenHeader";
import { Button } from "../components/Button";

export default function WishlistScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="My Favorites" />

      {wishlistItems.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <View className="w-32 h-32 bg-secondary dark:bg-dark-secondary rounded-full items-center justify-center mb-10 shadow-sm">
            <Heart
              size={56}
              color={isDark ? "#ffffff" : "#111827"}
              strokeWidth={1}
            />
          </View>
          <Text className="text-2xl font-black text-primary dark:text-dark-primary mb-2 text-center tracking-tighter uppercase">
            Collection Empty
          </Text>
          <Text className="text-muted dark:text-dark-muted text-center mb-12 leading-6 font-bold">
            Start saving your favorite minimalist pieces and premium essentials
            here.
          </Text>
          <Button
            label="Start Exploring"
            onPress={() => router.replace("/(tabs)/products" as any)}
            className="w-full"
          />
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-6 pt-8 pb-32"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center mb-8 bg-accent/30 dark:bg-dark-accent/10 p-4 rounded-[32px] border border-border/50 dark:border-dark-border/50"
              activeOpacity={0.9}
              onPress={() => router.push(`/(product)/${item.id}`)}
            >
              <View className="w-24 h-32 bg-secondary dark:bg-dark-secondary rounded-2xl overflow-hidden shadow-sm">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1 ml-5 justify-between h-32 py-1">
                <View>
                  <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[2px] mb-1">
                    {item.category}
                  </Text>
                  <Text
                    className="text-sm font-bold text-primary dark:text-dark-primary mb-1 tracking-tight"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-lg font-black text-primary dark:text-dark-primary tracking-tighter">
                    ${item.price}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => dispatch(toggleWishlist(item))}
                  className="bg-secondary dark:bg-dark-secondary flex-row items-center justify-center p-3 rounded-2xl border border-border dark:border-dark-border"
                >
                  <Trash2 size={16} color="#ef4444" strokeWidth={1.5} />
                  <Text className="ml-2 text-[10px] font-black text-primary dark:text-dark-primary uppercase tracking-widest">
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
