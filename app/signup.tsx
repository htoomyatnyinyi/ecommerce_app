import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUpMutation } from "../services/api/authApi";
import { UserPlus, ChevronLeft } from "lucide-react-native";

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, { isLoading }] = useSignUpMutation();
  const router = useRouter();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await signUp({ username, email, password }).unwrap();
      Alert.alert("Success", "Account created successfully! Please sign in.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (err: any) {
      Alert.alert("Signup Failed", err.data?.message || "Something went wrong");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
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
            className="w-12 h-12 bg-secondary rounded-2xl items-center justify-center mb-10 border border-border"
          >
            <ChevronLeft size={24} color="#111827" strokeWidth={1.5} />
          </TouchableOpacity>

          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-primary rounded-[28px] items-center justify-center shadow-xl shadow-slate-300">
              <UserPlus size={32} color="white" strokeWidth={1.5} />
            </View>
            <Text className="text-3xl font-black text-primary mt-8 tracking-tighter">
              Account
            </Text>
            <Text className="text-muted mt-2 font-black uppercase tracking-[3px] text-[10px]">
              Join the community
            </Text>
          </View>

          <View className="gap-6">
            <View>
              <TextInput
                className="bg-secondary border border-border rounded-3xl p-5 text-base text-primary font-bold"
                placeholder="John Doe"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View>
              <Text className="text-[10px] font-black text-muted mb-3 uppercase tracking-[2px] ml-1">
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
              className={`bg-primary rounded-[24px] p-5 items-center shadow-xl shadow-slate-400 mt-6 ${
                isLoading ? "opacity-70" : ""
              }`}
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <Text className="text-white text-sm font-black uppercase tracking-[3px]">
                {isLoading ? "Creating..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-10"
            onPress={() => router.replace("/login")}
          >
            <Text className="text-center text-muted font-bold tracking-tight">
              Already have an account?{" "}
              <Text className="text-primary font-black uppercase text-xs tracking-widest pl-2">
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
