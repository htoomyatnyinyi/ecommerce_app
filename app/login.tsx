import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignInMutation } from "@/services/api/authApi";
import { BASE_URL } from "@/services/api/baseApi";
import { User } from "lucide-react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");
  const [signIn, { isLoading }] = useSignInMutation();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      await signIn({ email, password }).unwrap();
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Login Failed", err.data?.message || "Invalid credentials");
    }
  };

  const handleFetchServer = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.text();
      console.log("Server Response:", data);
      Alert.alert("Connection Success", data);
    } catch (error) {
      console.error("Error fetching server:", error);
      Alert.alert(
        "Connection Failed",
        "Could not reach the server at " + BASE_URL
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          <View className="items-center mb-16">
            <View className="w-20 h-20 bg-primary rounded-[28px] items-center justify-center shadow-2xl shadow-slate-300">
              <User size={32} color="white" strokeWidth={1.5} />
            </View>
            <Text className="text-4xl font-black text-primary mt-8 tracking-tighter">
              SHOPIO
            </Text>
            <Text className="text-slate-400 mt-2 font-black uppercase tracking-[4px] text-[10px]">
              Premium Essentials
            </Text>
          </View>

          <TouchableOpacity className="mb-6" onPress={handleFetchServer}>
            <Text className="text-center text-muted font-bold tracking-tight">
              Test Server Connection
            </Text>
          </TouchableOpacity>

          <View className="gap-6">
            <View>
              <Text className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[2px] ml-1">
                Email Address
              </Text>
              <TextInput
                className="bg-secondary border border-border rounded-3xl p-5 text-base text-primary font-bold"
                placeholder="example@mail.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View>
              <Text className="text-[10px] font-black text-muted mb-3 uppercase tracking-[2px] ml-1">
                Password
              </Text>
              <TextInput
                className="bg-secondary border border-border rounded-3xl p-5 text-base text-primary font-bold"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#94a3b8"
              />
            </View>

            <TouchableOpacity
              className={`bg-primary rounded-3xl p-5 items-center shadow-xl shadow-slate-400 mt-6 ${
                isLoading ? "opacity-70" : ""
              }`}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <Text className="text-white text-sm font-black uppercase tracking-[3px]">
                {isLoading ? "Authenticating..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-10"
            onPress={() => router.push("/signup" as any)}
          >
            <Text className="text-center text-muted font-bold tracking-tight">
              Don't have an account?{" "}
              <Text className="text-primary font-black uppercase text-xs tracking-widest pl-2">
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
