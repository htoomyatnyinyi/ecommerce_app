import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { useGetCartQuery } from "../services/api/cartApi";
import {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} from "../services/api/checkoutApi";
import {
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  MapPin,
} from "lucide-react-native";

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: cartData } = useGetCartQuery(undefined);
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

  const total = cartData?.totalPrice || 0;

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      const { clientSecret, ephemeralKey, customer } =
        await createPaymentIntent({
          amount: Math.round(total * 100), // Stripe expects cents
          currency: "usd",
        }).unwrap();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Shopio Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: "Jane Doe",
        },
      });

      if (!error) {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not initialize payment sheet");
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
      router.replace("/(tabs)/products");
    }
  };

  useEffect(() => {
    if (total > 0) {
      initializePaymentSheet();
    }
  }, [total]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      <View className="px-6 py-6 flex-row items-center bg-background border-b border-border">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center bg-secondary rounded-2xl"
        >
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-xl font-black text-primary ml-4 tracking-tighter">
          Checkout
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Shipping Address Placeholder */}
        <View className="bg-secondary p-6 rounded-3xl mb-6">
          <View className="flex-row items-center mb-4">
            <MapPin size={20} color="#111827" strokeWidth={1.5} />
            <Text className="text-sm font-black text-primary ml-3 uppercase tracking-widest text-[10px]">
              Shipping Address
            </Text>
          </View>
          <Text className="text-sm text-muted leading-6 pl-8">
            123 Premium Lane, Suite 100{"\n"}
            Modern City, ST 12345
          </Text>
        </View>

        {/* Secure Checkout Badge */}
        <View className="bg-accent p-6 rounded-3xl mb-8 flex-row items-center">
          <ShieldCheck size={24} color="#111827" strokeWidth={1.5} />
          <View className="ml-4">
            <Text className="text-sm font-black text-primary uppercase tracking-[2px] text-[10px]">
              Secure Checkout
            </Text>
            <Text className="text-xs text-muted mt-1">
              PCI Compliant • SSL Encryption
            </Text>
          </View>
        </View>

        <View className="border-t border-border pt-8">
          <View className="flex-row justify-between mb-4">
            <Text className="text-muted font-bold uppercase tracking-widest text-[10px]">
              Subtotal
            </Text>
            <Text className="text-primary font-black tracking-tight">
              ${total}
            </Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-muted font-bold uppercase tracking-widest text-[10px]">
              Shipping
            </Text>
            <Text className="text-primary font-black uppercase text-[10px] tracking-widest">
              Complimentary
            </Text>
          </View>
          <View className="flex-row justify-between mt-6 pt-6 border-t border-dashed border-border">
            <Text className="text-primary text-xl font-black tracking-tighter uppercase">
              Total Amount
            </Text>
            <Text className="text-primary text-3xl font-black tracking-tighter">
              ${total}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-8 bg-background border-t border-border">
        <TouchableOpacity
          className={`bg-primary h-16 rounded-3xl items-center justify-center shadow-xl shadow-slate-900/10 ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
          onPress={openPaymentSheet}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex-row items-center">
              <CreditCard size={20} color="white" strokeWidth={1.5} />
              <Text className="text-primary-foreground font-black uppercase tracking-[3px] text-xs ml-3">
                Secure Payment
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
