import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { useVerifyEmailMutation } from "../services/api/authApi";
import { RootState } from "../services/store";
import { ScreenHeader } from "../components/ScreenHeader";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { MailCheck, ChevronLeft } from "lucide-react-native";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { token: initialToken } = useLocalSearchParams();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const [token, setToken] = useState((initialToken as string) || "");

  const handleVerify = async () => {
    if (!token.trim()) {
      Alert.alert(
        "Error",
        "Please enter the verification token from your email."
      );
      return;
    }

    try {
      await verifyEmail({ token: token.trim() }).unwrap();
      Alert.alert(
        "Success",
        "Email verified successfully! You can now use all features.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/(tabs)/products"),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        "Verification Failed",
        err.data?.message || "Invalid or expired token."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-6 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 bg-secondary dark:bg-dark-secondary rounded-2xl items-center justify-center border border-border dark:border-dark-border"
        >
          <ChevronLeft
            size={24}
            color={isDark ? "#ffffff" : "#111827"}
            strokeWidth={1.5}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerClassName="flex-grow px-8 pt-10 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-12">
          <View className="w-24 h-24 bg-primary/10 rounded-[32px] items-center justify-center mb-8">
            <MailCheck
              size={48}
              color={isDark ? "#60a5fa" : "#3b82f6"}
              strokeWidth={1.5}
            />
          </View>
          <Text className="text-3xl font-black text-primary dark:text-dark-primary tracking-tighter text-center">
            Verify Email
          </Text>
          <Text className="text-muted dark:text-dark-muted mt-4 font-bold text-center leading-6">
            We've sent a verification link to your email. Please enter the token
            here or tap the link in your email.
          </Text>
        </View>

        <View className="gap-6">
          <Input
            label="Verification Token"
            placeholder="Enter token from email"
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
          />

          <Button
            label="Verify Account"
            onPress={handleVerify}
            loading={isLoading}
            className="mt-4"
          />

          <TouchableOpacity
            onPress={() => router.replace("/signin")}
            className="mt-6"
          >
            <Text className="text-center text-muted dark:text-dark-muted font-bold">
              Want to sign in with another account?{" "}
              <Text className="text-primary dark:text-dark-primary font-black uppercase text-xs tracking-widest pl-2">
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
