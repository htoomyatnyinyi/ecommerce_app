import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSignUpMutation } from "@/services/api/authApi";
import { UserPlus, ChevronLeft } from "lucide-react-native";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useSelector } from "react-redux";
import { RootState } from "@/services/store";

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUp, { isLoading }] = useSignUpMutation();
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await signUp({ username, email, password, confirmPassword }).unwrap();
      Alert.alert(
        "Success",
        "Account created successfully! Please check your email for a verification link.",
        [{ text: "OK", onPress: () => router.replace("/signin") }]
      );
    } catch (err: any) {
      Alert.alert(
        "Signup Failed",
        err.data?.message || err.data?.error || "Something went wrong"
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow px-8 pt-4 pb-12"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 bg-secondary dark:bg-dark-secondary rounded-2xl items-center justify-center mb-10 border border-border dark:border-dark-border"
          >
            <ChevronLeft
              size={24}
              color={isDark ? "#ffffff" : "#111827"}
              strokeWidth={1.5}
            />
          </TouchableOpacity>

          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-primary rounded-[28px] items-center justify-center shadow-xl shadow-slate-900/10">
              <UserPlus size={32} color="white" strokeWidth={1.5} />
            </View>
            <Text className="text-3xl font-black text-primary dark:text-dark-primary mt-8 tracking-tighter">
              Account
            </Text>
            <Text className="text-muted dark:text-dark-muted mt-2 font-black uppercase tracking-[3px] text-[10px]">
              Join the community
            </Text>
          </View>

          <View className="gap-6">
            <Input
              label="User Name"
              placeholder="John Doe"
              value={username}
              onChangeText={setUsername}
            />

            <Input
              label="Email Address"
              placeholder="example@mail.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Input
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <Button
              label="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              className="mt-6"
            />
          </View>

          <TouchableOpacity
            className="mt-10"
            onPress={() => router.replace("/signin")}
          >
            <Text className="text-center text-muted dark:text-dark-muted font-bold tracking-tight">
              Already have an account?{" "}
              <Text className="text-primary dark:text-dark-primary font-black uppercase text-xs tracking-widest pl-2">
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
