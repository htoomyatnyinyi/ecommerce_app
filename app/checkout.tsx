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
import { useGetAddressesQuery } from "../services/api/addressApi";
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
  const { data: addressesData } = useGetAddressesQuery();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

  const total = cartData?.totalPrice || 0;
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  // console.log("addressesData", addressesData);
  // Get the first address or primary address for default
  const defaultAddress = addressesData?.[0];
  const displayAddress = defaultAddress
    ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.postalCode}`
    : "No shipping address found. Please add one in your profile.";

  const initializePaymentSheet = async () => {
    try {
      const {
        clientSecret,
        ephemeralKey,
        customer,
        paymentIntentId: piId,
      } = await createPaymentIntent({
        amount: Math.round(total * 100),
        currency: "usd",
        shippingAddressId: defaultAddress?.id,
        billingAddressId: defaultAddress?.id,
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

      if (error) {
        console.error("Payment sheet init error:", error);
        Alert.alert("Error", "Could not initialize payment sheet");
      }
    } catch (e: any) {
      console.error("Payment initialization error:", e);
      const errorMessage =
        e?.data?.message || "Could not initialize payment sheet";
      Alert.alert("Error", errorMessage);
    }
  };

  const openPaymentSheet = async () => {
    // Ensure payment sheet is initialized before opening
    if (!paymentIntentId) {
      try {
        await initializePaymentSheet();
      } catch (initErr) {
        console.error("Failed to initialize payment sheet:", initErr);
        return;
      }
    }

    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code !== "Canceled") {
        Alert.alert(`Error code: ${error.code}`, error.message);
      }
    } else {
      try {
        setLoading(true);
        await confirmPayment({
          paymentIntentId,
          shippingAddressId: defaultAddress?.id,
          billingAddressId: defaultAddress?.id,
        }).unwrap();

        Alert.alert("Success", "Your order is confirmed!");
        router.replace("/(tabs)/products");
      } catch (confirmErr: any) {
        console.error("Order confirmation failed:", confirmErr);
        Alert.alert(
          "Error",
          confirmErr?.data?.message ||
            "Payment succeeded but order creation failed. Please contact support.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (total > 0 && addressesData) {
      initializePaymentSheet();
    }
  }, [total, addressesData]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScreenHeader title="Checkout" />

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-secondary dark:bg-dark-secondary p-6 rounded-4xl mb-6 border border-border dark:border-dark-border">
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
            {displayAddress}
          </Text>
        </View>

        <View className="bg-accent dark:bg-dark-accent p-6 rounded-4xl mb-8 flex-row items-center border border-border dark:border-dark-border">
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
          onPress={() => {
            if (!defaultAddress) {
              Alert.alert(
                "Address Missing",
                "Please add a shipping address before proceeding.",
              );
              return;
            }
            openPaymentSheet();
          }}
          loading={loading}
          disabled={total === 0 || !addressesData}
        />
      </View>
    </SafeAreaView>
  );
}
