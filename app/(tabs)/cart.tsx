import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import {
  useGetCartQuery,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
} from "../../services/api/cartApi";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react-native";
import { RootState } from "../../services/store";
import { Button } from "../../components/Button";

export default function CartScreen() {
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const { data: cartData, isLoading } = useGetCartQuery(undefined);
  const [updateQuantity] = useUpdateCartQuantityMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

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

  const cartItems = cartData?.getCart || [];
  const total = cartData?.totalPrice || 0;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-6 py-6 bg-background dark:bg-dark-background flex-row justify-between items-end border-b border-border dark:border-dark-border">
        <View>
          <Text className="text-[10px] text-muted dark:text-dark-muted font-bold uppercase tracking-[3px] mb-1">
            Shopping
          </Text>
          <Text className="text-3xl font-black text-primary dark:text-dark-primary tracking-tighter">
            Your Bag
          </Text>
        </View>
        <Text className="text-sm font-bold text-muted dark:text-dark-muted mb-1">
          {cartItems.length} items
        </Text>
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <View className="w-32 h-32 bg-secondary dark:bg-dark-secondary rounded-full items-center justify-center mb-8">
            <ShoppingBag
              size={56}
              color={isDark ? "#ffffff" : "#111827"}
              strokeWidth={1}
            />
          </View>
          <Text className="text-2xl font-black text-primary dark:text-dark-primary mb-2 text-center tracking-tighter uppercase">
            Empty Bag
          </Text>
          <Text className="text-muted dark:text-dark-muted text-center mb-10 leading-6 font-bold">
            Your shopping bag is empty. Start adding some minimalist essentials.
          </Text>
          <Button
            label="Discover Now"
            onPress={() => router.replace("/(tabs)/products" as any)}
            className="w-full"
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="p-6 pb-40"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="flex-row items-center mb-8 bg-accent/30 dark:bg-dark-accent/10 p-4 rounded-[32px] border border-border/50 dark:border-dark-border/50">
                <View className="w-24 h-32 bg-secondary dark:bg-dark-secondary rounded-2xl overflow-hidden shadow-sm">
                  <Image
                    source={{
                      uri:
                        item.product?.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop",
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                <View className="flex-1 ml-5 justify-between h-32 py-1">
                  <View>
                    <Text
                      className="text-sm font-bold text-primary dark:text-dark-primary mb-1 uppercase tracking-tight"
                      numberOfLines={1}
                    >
                      {item.product?.title || item.product?.name}
                    </Text>
                    <Text className="text-xs text-muted dark:text-dark-muted font-medium lowercase italic">
                      {item.variant?.color} / {item.variant?.size}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center bg-secondary dark:bg-dark-secondary rounded-full px-2 py-1 border border-border dark:border-dark-border">
                      <TouchableOpacity
                        className="w-8 h-8 items-center justify-center"
                        onPress={() =>
                          updateQuantity({
                            cartItemId: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                      >
                        <Minus
                          size={14}
                          color={isDark ? "#ffffff" : "#111827"}
                        />
                      </TouchableOpacity>
                      <Text className="mx-3 font-black text-primary dark:text-dark-primary text-xs">
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        className="w-8 h-8 items-center justify-center"
                        onPress={() =>
                          updateQuantity({
                            cartItemId: item.id,
                            quantity: item.quantity + 1,
                          })
                        }
                      >
                        <Plus
                          size={14}
                          color={isDark ? "#ffffff" : "#111827"}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-lg font-black text-primary dark:text-dark-primary tracking-tighter">
                      ${item.variant?.price || item.product?.price}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  className="absolute top-4 right-4 p-2"
                  onPress={() => removeFromCart({ removeCartItemId: item.id })}
                >
                  <Trash2 size={16} color="#ef4444" strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            )}
          />

          <View className="absolute bottom-0 left-0 right-0 p-8 pt-6 bg-background dark:bg-dark-background border-t border-border dark:border-dark-border shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-muted dark:text-dark-muted font-bold uppercase tracking-[2px] text-[10px]">
                Subtotal
              </Text>
              <Text className="text-2xl font-black text-primary dark:text-dark-primary tracking-tighter">
                ${total}
              </Text>
            </View>
            <Button
              label="Proceed to Payment"
              onPress={() => router.push("/checkout" as any)}
              className="w-full"
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
