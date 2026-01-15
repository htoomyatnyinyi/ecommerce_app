import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Heart } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function WishlistScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      <View className="px-6 py-6 bg-background">
        <Text className="text-[10px] text-muted font-bold uppercase tracking-[3px] mb-1">
          Favorites
        </Text>
        <Text className="text-3xl font-black text-primary tracking-tighter">
          Wishlist
        </Text>
      </View>

      <View className="flex-1 justify-center items-center px-10">
        <View className="w-32 h-32 bg-secondary rounded-full items-center justify-center mb-10 shadow-sm">
          <Heart size={56} color="#111827" strokeWidth={1} />
        </View>
        <Text className="text-2xl font-black text-primary mb-2 text-center tracking-tighter">
          Collection Empty
        </Text>
        <Text className="text-muted text-center mb-12 leading-6 px-4">
          Save your favorite minimalist pieces and premium essentials here to
          view them later.
        </Text>
        <TouchableOpacity
          className="bg-primary w-full py-5 rounded-3xl shadow-xl shadow-slate-900/10"
          activeOpacity={0.8}
          onPress={() => router.push("/")}
        >
          <Text className="text-primary-foreground text-center font-black uppercase tracking-[3px] text-xs">
            Start Exploring
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
