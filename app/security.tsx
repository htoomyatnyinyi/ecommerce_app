import React, { useState } from "react";
import { View, SafeAreaView, StatusBar, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useUpdatePasswordMutation } from "../services/api/userApi";
import { RootState } from "../services/store";
import { ScreenHeader } from "../components/ScreenHeader";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function SecurityScreen() {
  const router = useRouter();
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await updatePassword({ currentPassword, newPassword }).unwrap();
      Alert.alert("Success", "Password updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.data?.message || "Failed to update password");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Security" />

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <Input
            label="Current Password"
            placeholder="••••••••"
            secureTextEntry
            value={form.currentPassword}
            onChangeText={(text) => setForm({ ...form, currentPassword: text })}
          />

          <View className="h-4" />

          <Input
            label="New Password"
            placeholder="••••••••"
            secureTextEntry
            value={form.newPassword}
            onChangeText={(text) => setForm({ ...form, newPassword: text })}
          />

          <Input
            label="Confirm New Password"
            placeholder="••••••••"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
          />

          <View className="mt-8">
            <Button
              label="Update Password"
              onPress={handleUpdatePassword}
              loading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
