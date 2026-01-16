import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useGetCartQuery } from "../services/api/cartApi";
import { useAuthMeQuery } from "../services/api/authApi";
import {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} from "../services/api/checkoutApi";
import { CreditCard, ShieldCheck, MapPin } from "lucide-react-native";
import { ScreenHeader } from "../components/ScreenHeader";
import { Button } from "../components/Button";
import { RootState } from "../services/store";

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const { data: user } = useAuthMeQuery(null);
  const { data: cartData } = useGetCartQuery(undefined);
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

  const total = cartData?.totalPrice || 0;
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      const {
        clientSecret,
        ephemeralKey,
        customer,
        paymentIntentId: piId,
      } = await createPaymentIntent({
        amount: Math.round(total * 100),
        currency: "usd",
      }).unwrap();

      setPaymentIntentId(piId);

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Shopio Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: user?.username || "Guest User",
          email: user?.email,
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
      if (error.code !== "Canceled") {
        Alert.alert(`Error code: ${error.code}`, error.message);
      }
    } else {
      try {
        setLoading(true);
        await confirmPayment({ paymentIntentId }).unwrap();
        Alert.alert("Success", "Your order is confirmed!");
        router.replace("/(tabs)/products");
      } catch (confirmErr) {
        console.error("Order confirmation failed:", confirmErr);
        Alert.alert(
          "Error",
          "Payment succeeded but order creation failed. Please contact support."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (total > 0) {
      initializePaymentSheet();
    }
  }, [total]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScreenHeader title="Checkout" />

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-secondary dark:bg-dark-secondary p-6 rounded-[32px] mb-6 border border-border dark:border-dark-border">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 rounded-xl bg-accent dark:bg-dark-accent items-center justify-center">
              <MapPin
                size={18}
                color={isDark ? "#ffffff" : "#111827"}
                strokeWidth={1.5}
              />
            </View>
            <Text className="text-[10px] font-black text-primary dark:text-dark-primary ml-3 uppercase tracking-[2px]">
              Shipping Address
            </Text>
          </View>
          <Text className="text-sm text-muted dark:text-dark-muted leading-6 pl-11 font-bold">
            123 Premium Lane, Suite 100{"\n"}
            Modern City, ST 12345
          </Text>
        </View>

        <View className="bg-accent dark:bg-dark-accent p-6 rounded-[32px] mb-8 flex-row items-center border border-border dark:border-dark-border">
          <ShieldCheck
            size={24}
            color={isDark ? "#ffffff" : "#111827"}
            strokeWidth={1.5}
          />
          <View className="ml-4">
            <Text className="text-[10px] font-black text-primary dark:text-dark-primary uppercase tracking-[2px]">
              Secure Checkout
            </Text>
            <Text className="text-xs text-muted dark:text-dark-muted mt-1 font-medium">
              PCI Compliant • SSL Encryption
            </Text>
          </View>
        </View>

        <View className="border-t border-border dark:border-dark-border pt-8">
          <View className="flex-row justify-between mb-4">
            <Text className="text-muted dark:text-dark-muted font-black uppercase tracking-widest text-[10px]">
              Subtotal
            </Text>
            <Text className="text-primary dark:text-dark-primary font-black tracking-tight">
              ${total}
            </Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-muted dark:text-dark-muted font-black uppercase tracking-widest text-[10px]">
              Shipping
            </Text>
            <Text className="text-primary dark:text-dark-primary font-black uppercase text-[10px] tracking-widest">
              Complimentary
            </Text>
          </View>
          <View className="flex-row justify-between mt-6 pt-6 border-t border-dashed border-border dark:border-dark-border">
            <Text className="text-primary dark:text-dark-primary text-xl font-black tracking-tighter uppercase">
              Total Amount
            </Text>
            <Text className="text-primary dark:text-dark-primary text-3xl font-black tracking-tighter">
              ${total}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="p-8 bg-background dark:bg-dark-background border-t border-border dark:border-dark-border">
        <Button
          label="Secure Payment"
          icon={CreditCard}
          onPress={openPaymentSheet}
          loading={loading}
          disabled={total === 0}
        />
      </View>
    </SafeAreaView>
  );
}
