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
  StatusBar,
} from "react-native";
import { useSignInMutation } from "@/services/api/authApi";
import { User as UserIcon } from "lucide-react-native";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useSelector } from "react-redux";
import { RootState } from "@/services/store";

export default function LoginScreen() {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");
  const [signIn, { isLoading }] = useSignInMutation();
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      await signIn({ email, password }).unwrap();
      router.replace("/(tabs)/products");
    } catch (err: any) {
      Alert.alert("Login Failed", err.data?.message || "Invalid credentials");
    }
  };

  const handleTestApi = async () => {
    try {
      const a = await fetch("http://localhost:8080/api/auth/auth-me");
      Alert.alert("Test API", "Success");
      console.log(a, "return data");
    } catch (err: any) {
      Alert.alert("Test API", "Failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          <View className="items-center mb-16">
            <View className="w-20 h-20 bg-primary rounded-[28px] items-center justify-center shadow-2xl shadow-slate-900/10">
              <UserIcon size={32} color="white" strokeWidth={1.5} />
            </View>
            <Text className="text-4xl font-black text-primary dark:text-dark-primary mt-8 tracking-tighter">
              SHOPIO
            </Text>
            <Text className="text-muted dark:text-dark-muted mt-2 font-black uppercase tracking-[4px] text-[10px]">
              Premium Essentials
            </Text>
            <TouchableOpacity onPress={handleTestApi} className="mt-6">
              <Text className="text-primary dark:text-dark-primary font-black uppercase tracking-tight">
                Test API
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-6">
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

            <Button
              label="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              className="mt-6"
            />
          </View>

          <TouchableOpacity
            className="mt-10"
            onPress={() => router.push("/signup" as any)}
          >
            <Text className="text-center text-muted dark:text-dark-muted font-bold tracking-tight">
              Don't have an account?{" "}
              <Text className="text-primary dark:text-dark-primary font-black uppercase text-xs tracking-widest pl-2">
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
