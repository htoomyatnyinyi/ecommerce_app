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
import {
  useGetCartQuery,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
} from "../../services/api/cartApi";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react-native";

export default function CartScreen() {
  const router = useRouter();
  const { data: cartData, isLoading } = useGetCartQuery(undefined);
  const [updateQuantity] = useUpdateCartQuantityMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  const cartItems = cartData?.getCart || [];
  const total = cartData?.totalPrice || 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      {/* Modern Header */}
      <View className="px-6 py-6 bg-background flex-row justify-between items-end">
        <View>
          <Text className="text-[10px] text-muted font-bold uppercase tracking-[3px] mb-1">
            Shopping
          </Text>
          <Text className="text-3xl font-black text-primary tracking-tighter">
            Your Bag
          </Text>
        </View>
        <Text className="text-sm font-bold text-muted mb-1">
          {cartItems.length} items
        </Text>
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <View className="w-32 h-32 bg-secondary rounded-full items-center justify-center mb-8">
            <ShoppingBag size={56} color="#111827" strokeWidth={1} />
          </View>
          <Text className="text-2xl font-black text-primary mb-2 text-center tracking-tighter">
            Empty Bag
          </Text>
          <Text className="text-muted text-center mb-10 leading-6">
            Your shopping bag is empty. Start adding some minimalist essentials.
          </Text>
          <TouchableOpacity
            className="bg-primary w-full py-5 rounded-3xl"
            activeOpacity={0.8}
            onPress={() => router.push("/")}
          >
            <Text className="text-primary-foreground text-center font-black uppercase tracking-[2px]">
              Discover Now
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="p-6 pb-40"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="flex-row items-center mb-8">
                <View className="w-24 h-32 bg-secondary rounded-3xl overflow-hidden shadow-sm">
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
                      className="text-sm font-bold text-primary mb-1 uppercase tracking-tight"
                      numberOfLines={1}
                    >
                      {item.product?.name}
                    </Text>
                    <Text className="text-xs text-muted font-medium lowercase italic">
                      {item.variant?.color} / {item.variant?.size}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center bg-accent rounded-full px-2 py-1">
                      <TouchableOpacity
                        className="w-8 h-8 items-center justify-center"
                        onPress={() =>
                          updateQuantity({
                            cartItemId: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                      >
                        <Minus size={14} color="#111827" />
                      </TouchableOpacity>
                      <Text className="mx-3 font-black text-primary text-xs">
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
                        <Plus size={14} color="#111827" />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-lg font-black text-primary">
                      ${item.product?.price}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  className="absolute top-0 right-0 p-2"
                  onPress={() => removeFromCart({ removeCartItemId: item.id })}
                >
                  <Trash2 size={16} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Minimalist Checkout Bar */}
          <View className="absolute bottom-0 left-0 right-0 p-8 pt-6 bg-background border-t border-border shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-muted font-bold uppercase tracking-[2px] text-[10px]">
                Subtotal
              </Text>
              <Text className="text-2xl font-black text-primary tracking-tighter">
                ${total}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-primary h-16 rounded-3xl items-center justify-center shadow-xl shadow-slate-900/10"
              activeOpacity={0.9}
              onPress={() => router.push("/checkout" as any)}
            >
              <Text className="text-primary-foreground font-black uppercase tracking-[3px] text-xs">
                Process to Payment
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
